import {Chart, Container, Deployment, Role} from "../src/generator"

const chart = new Chart({
    name: "containers-registry",
    version: "0.1.1",
    description: "Docker-registry"
})

const container = new Container("alexstorm-hsm-ci");
container.setEnv({"zmq.SocketUrl":"tcp://*:{{ .Values.containers.router.zmqPort}}"})

chart.addDeployment(new Deployment("ci", [container]));
chart.addRole(new Role());