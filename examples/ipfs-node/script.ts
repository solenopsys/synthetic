
import {
    Deploy, Ingress, Service, LoadBalancer,
    Port, ConfigMap, ConfigVolume, VolumeClaim,
    HostPath, Volume, StatefullSet, ExternalService, Container, GB
} from "@solenopsys/synthetic";

import yaml from "js-yaml";
import fs from "fs";
import { VolumeType } from "src/structs";

const routing = "dhtclient"

type Config = {
    name: string,
    description: string,
    version: string,
    swarmKey: string,
    nodes: { [key: string]: string }
    volumesSizes: {
        staging: string
        data: string
    }
}

function loadConfigFromYaml(file: string): Config {
    const bytes = fs.readFileSync(file, "utf-8");
    return yaml.load(bytes) as Config;
}

const config: Config = loadConfigFromYaml("config.yaml");

export const dp = new Deploy(config)

// ports
const gateway: Port = new Port("gateway", 8080)
const rpc: Port = new Port("rpc", 5001)
const p2p: Port = new Port("p2p", 4001)


//services
const ipfsService = new Service(config.name).addPort(rpc).addPort(gateway);
dp.add(ipfsService)
dp.add(new LoadBalancer(config.name).addPort(p2p))

for (let key in config.nodes)
    dp.add(new ExternalService(key).addPort(p2p))


// config maps
function genSript() {
    let script = `#!/bin/sh
    set -ex
    ipfs bootstrap rm all\n\n`;

    for (let key in config.nodes)
        script += `ipfs bootstrap add "/dns4/${key}.default.svc.cluster.local/tcp/${p2p.port}/p2p/${config.nodes[key]}"\n\n`;

    script += `ipfs config Routing --json '{ "Type": "${routing}" }' `;
    return script
}

const bootstrapConf = new ConfigMap("ipfs-bootstrap")
bootstrapConf.set("bootstrap.sh", genSript())

const swarmConf = new ConfigMap("swarm-key")
swarmConf.set("swarm.key", `
/key/swarm/psk/1.0.0/
/base16/
${config.swarmKey}
`)




// claims
const stagingClaim = new VolumeClaim("staging", config.volumesSizes.staging * GB)
const dataClaim = new VolumeClaim("data", config.volumesSizes.data * GB);

// volumes
const stagingVolume: VolumeType = new HostPath(stagingClaim, "/opt/ipfs-staging")
const dataVolume: VolumeType = new HostPath(dataClaim, "/opt/ipfs-data")
const swarmVolume: VolumeType = new ConfigVolume(swarmConf, "swarm.key")
const bootstrapVolume: VolumeType = new ConfigVolume(bootstrapConf, "bootstrap.sh")

// Containers
const kubo: Container = new Container("kubo", "ipfs/kubo")
kubo.env("LIBP2P_FORCE_PNET", "1")
kubo.addPort(gateway).addPort(rpc).addPort(p2p)
kubo.mountVolume(stagingVolume, "/export")
kubo.mountVolume(dataVolume, " /data/ipfs")
kubo.mountVolume(swarmVolume, "/data/ipfs")
kubo.mountVolume(bootstrapVolume, "/container-init.d/bootstrap.sh")

// Pods
const ipfsPod: StatefullSet = new StatefullSet(config.name, 1)
ipfsPod.addContainer(kubo)

dp.add(ipfsPod)


// ingress
const ingress = new Ingress(config.name)
ingress.addDomain("ipfs.solenopsys.org", ipfsService, gateway, "/")
dp.add(ingress)