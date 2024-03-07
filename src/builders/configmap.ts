import { DEFAULTS } from "src/defaults";
import { Builder, StructPrint } from "src/interfaces";
import { ConfigMapType } from "src/structs";

export class ConfigMap extends Builder<ConfigMapType> {
    constructor(private name: string) {
        super()
    }

    getName(): string {
        return this.name
    }

    init(): ConfigMapType {
        return DEFAULTS.CONFIGMAP(this.name)
    }

    set(key: string, value: string) {
        this.conf.data[key] = value
        return this
    }
}