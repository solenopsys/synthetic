import {REGISTRY_SOLENOPSYS} from "../src/generator"
import {Container, Deployment, Role} from "../src/model";
import {Manage} from "../src/manage";
export const manage = new Manage({
    name: "HSM",
    version: "0.1.2",
    description: "Continuous integration module"
})

const zmqPort = 5555;
const ci = new Container("alexstorm-hsm-ci", REGISTRY_SOLENOPSYS);
ci.setEnv({"zmq.SocketUrl": `tcp://*:${ zmqPort}`})

manage.addDeployment(new Deployment("ci", [ci]));
manage.addRole(new Role());