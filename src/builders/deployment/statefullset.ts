
import { Deploy } from "src/deploy";
import { Container } from "../../parts/container";
import { Service } from "../servises/service";
import { Deployment } from "./deployment";
import { Builder } from "src/interfaces";
import { DEFAULTS } from "src/defaults";
import { StatefullSetType } from "src/structs";

export class StatefullSet extends Builder<StatefullSetType> {
    constructor(private name: string, private replicas: number) {
        super()
    }

    getName(): string {
        return this.name
    }

    init(): StatefullSetType {
        return DEFAULTS.STATEFULLSET(this.name, this.replicas)
    }

    addContainer(container: Container) {
        super.conf.spec!.template.spec.containers.push(container.export())
    }

}