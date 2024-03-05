
import {
    Deploy, Ingress, Service, LoadBalancer,
    Port, ConfigMap, ConfigVolume, VolumeClaim,
    HostPath, Volume, StatefullSet, ExternalService, loadFrom, Container, GB
} from "@solenopsys/synthetic";

const name = "ipfs-node"
const description = "IPFS node"


const routing = "dhtclient"

type Config = {
    version: string,
    swarmKey: string,
    nodes: { [key: string]: string }
    volumes: {
        staging: number
        data: number
    }
}

const config: Config = loadFrom("config.json");

export const dp = new Deploy({ name, config: config.version, description })

// ports
const gateway: Port = new Port("gateway", 8080)
const rpc: Port = new Port("rpc", 5001)
const p2p: Port = new Port("p2p", 4001)

//services
dp.add(new Service(name).addPort(rpc).addPort(gateway))
dp.add(new LoadBalancer(name).addPort(p2p))

for (let key in config.nodes)
    dp.add(new ExternalService(key).addPort(p2p))


// config maps
function genSript() {
    let script = `#!/bin/sh
    set -ex
    ipfs bootstrap rm all\n\n`;

    for (let key in config.nodes)
        script += `ipfs bootstrap add "/dns4/${key}.default.svc.cluster.local/tcp/${p2p.port}/p2p/${nodes[key]}"\n\n`;

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

// ingress
dp.add(new Ingress())


// claims
const stagingClaim = new VolumeClaim("staging", config.volumes.staging * GB)
const dataClaim = new VolumeClaim("data", config.volumes.data * GB);

// volumes
const stagingVolume: Volume = new HostPath(stagingClaim, "/opt/ipfs-staging")
const dataVolume: Volume = new HostPath(dataClaim, "/opt/ipfs-data")
const swarmVolume: Volume = new ConfigVolume(swarmConf, "swarm.key")
const bootstrapVolume: Volume = new ConfigVolume(bootstrapConf, "bootstrap.sh")

// Containers
const kubo: Container = new Container("kubo", "ipfs/kubo")
kubo.env("LIBP2P_FORCE_PNET", "1")
kubo.addPort(gateway).addPort(rpc).addPort(p2p)
kubo.mountVolume(stagingVolume, "/export")
kubo.mountVolume(dataVolume, " /data/ipfs")
kubo.mountVolume(swarmVolume, "/data/ipfs")
kubo.mountVolume(bootstrapVolume, "/container-init.d/bootstrap.sh")

// Pods
const ipfsPod: StatefullSet = new StatefullSet(name, 1)
ipfsPod.addContainer(kubo)

dp.add(ipfsPod)

