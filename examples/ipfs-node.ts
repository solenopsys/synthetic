
import { Deploy, Ingress, Service, LoadBalancer } from "@solenopsys/synthetic";

const name = "ipfs-node";

export const dp = new Deploy({
    name, version: "0.1.39", description: "IPFS node"
})

dp.add(new Service(name).port("gateway", 8080).port("rpc", 5001))
dp.add(new LoadBalancer(name).port("p2p", 4001))

dp.add(new Ingress()) 