
import {
    Deploy,
    Ingress,
    Service,
    LoadBalancer,
    Port,
    ConfigMap,
    ConfigVolume,
    VolumeClaim,
    HostPath,
    Volume,
    StatefullSet
} from "@solenopsys/synthetic";


const routing = "dhtclient"

import { Container } from "../src/model";

const name = "ipfs-node"
const version = "0.1.39"
const description = "IPFS node"

export const dp = new Deploy({ name, version, description })

// ports
const gateway: Port = new Port("gateway", 8080)
const rpc: Port = new Port("rpc", 5001)
const p2p: Port = new Port("p2p", 4001)



// config maps
function genSript() {
    const bootstrap: string[] = [
        "/dns4/alpha-ipfs-node-service.default.svc.cluster.local/tcp/4001/p2p/12D3KooWL2A1zj6oqVSRtanyZGDwJaEApxcg1JDAaCRbLayQ3aFd",
        "/dns4/bravo-ipfs-node-service.default.svc.cluster.local/tcp/4001/p2p/12D3KooWHQNAJ2iLFFxpvH9YwE4r9MVMrYoQ9YxiVGY5L3qTJi1w",
        "/dns4/charlie-ipfs-node-service.default.svc.cluster.local/tcp/4001/p2p/12D3KooWCG8XDMrBD8dSpEhoUhVUxAoGh3akYPVXFzKYVJ22yzQK"
    ]

    let script = `#!/bin/sh
    set -ex
    ipfs bootstrap rm all\n\n`;

    for (let value of bootstrap)
        script += `ipfs bootstrap add "${value}"\n\n`;

    script += `ipfs config Routing --json '{ "Type": "${routing}" }' `;
    return script
}


const bootstrapConf = new ConfigMap("ipfs-bootstrap")
bootstrapConf.set("bootstrap.sh", genSript())

const swarmConf = new ConfigMap("swarm-key")
swarmConf.set("swarm.key", `
/key/swarm/psk/1.0.0/
/base16/
0472d6ec079252b82ba680c6b0e811c529d2dfa99f92cb7d13b5ad560ae10d7c
`)

//services
dp.add(new Service(name).addPort(rpc).addPort(gateway))
dp.add(new LoadBalancer(name).addPort(p2p))

// ingress
dp.add(new Ingress())

// claims
const stagingClaim = new VolumeClaim("staging-vol", "1Gi")
const dataClaim = new VolumeClaim("data-vol", "10Gi");

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
const ipfsPod: StatefullSet = new StatefullSet("name", 1)
ipfsPod.addContainer(kubo)

dp.add(ipfsPod)

