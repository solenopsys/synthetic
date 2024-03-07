import { Builder } from "../../interfaces";
import { DEFAULTS } from "../../defaults";
import { Port, ServiceType, ServiceTypes } from "src/structs";

export class Service extends Builder<ServiceType> {
    constructor(private name: string, private podName?: string) {
        super()
    }

    getName(): string {
        return this.name
    }

    init(): ServiceType {
        return DEFAULTS.SERVICE(this.name, this.podName, ServiceTypes.Service)
    }

    addPort(port: Port): Service {
        return this.newPort(port.name, port.port)
    }

    newPort(name: string, port: number, targetPort?: number): Service {
        this.conf.spec?.ports.push({ name, port, targetPort: targetPort ? targetPort : port })
        return this
    }
}