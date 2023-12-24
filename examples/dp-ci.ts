import {REGISTRY_SOLENOPSYS} from "../src/generator"
import {Container, Deployment, Role} from "../src/model";
import {Manage} from "../src/manage";

export const manage = new Manage({
    name: "HSM",
    version: "0.1.2",
    description: "Continuous integration module"
})

const ci = new Container("alexstorm-hsm-ci", REGISTRY_SOLENOPSYS);
ci.setEnv({"zmq.SocketUrl": "tcp://*:{{ .Values.containers.router.zmqPort}}"})

manage.addDeployment(new Deployment("ci", [ci]));
manage.addRole(new Role());