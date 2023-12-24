import { Container, Deployment, Role} from "../src/model"
import {Manage} from "../src/manage";

const manage = new Manage({
    name: "containers-registry",
    version: "0.1.1",
    description: "Docker-registry"
})

const container = new Container("alexstorm-hsm-ci");
container.setEnv({"zmq.SocketUrl":"tcp://*:{{ .Values.containers.router.zmqPort}}"})

manage.addDeployment(new Deployment("ci", [container]));
manage.addRole(new Role());