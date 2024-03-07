import { Builder, } from "../../interfaces";
import { Container } from "../../parts/container";
import { DeploymentType } from "src/structs";
import { DEFAULTS } from "src/defaults";

export class Deployment extends Builder<DeploymentType> {

    constructor(private name: string) {
        super()
    }

    getName(): string {
        return this.name
    }

    init(): DeploymentType {
        return DEFAULTS.DEPLOYMENT(this.name, 1)
    }

    addContainer(container: Container) {
        this.conf.spec!.template.spec.containers.push(container.export())
    }

}