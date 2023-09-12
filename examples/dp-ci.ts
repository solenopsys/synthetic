import {  generate, REGISTRY_SOLENOPSYS} from "../src/generator"
import {Container} from "../src/container";
import {Deployment} from "../src/deployment";
import {Role} from "../src/role";
import {Chart} from "../src/chart";

const chart = new Chart({
    name: "HSM",
    version: "0.1.2",
    description: "Continuous integration module"
})

const ci = new Container("alexstorm-hsm-ci", REGISTRY_SOLENOPSYS);
ci.setEnv({"zmq.SocketUrl": "tcp://*:{{ .Values.containers.router.zmqPort}}"})

chart.addDeployment(new Deployment("ci", [ci]));
chart.addRole(new Role());

export default chart;

generate(chart)