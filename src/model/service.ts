import { StructPrint } from "../interfaces";
import { ServiceIntf, ServiceTypes, type Port } from "./intfs";





export class Service implements StructPrint {


    protected conf: ServiceIntf

    default(): ServiceIntf {
        return {
            apiVersion: 'v1',
            kind: 'Service',
            metadata: {
                labels: {
                    app: this.name + "-service",
                },
                name: this.name,
            },

            spec: {
                ports: [

                ],
                selector: {
                    app: (this.podName ? this.podName : this.name) + "-pod",
                },
                type: ServiceTypes.Service
            },
        }

    }



    constructor(private name: string, private podName?: string) {
        this.conf = this.default()
    }

    addPort(port: Port): Service {
       return this.newPort(port.name, port.port)
    }
    newPort(name: string, port: number, targetPort?: number): Service {
        this.conf.spec?.ports.push({ name, port, targetPort: targetPort ? targetPort : port })
        return this
    }


    export(): any {

        return this.conf;
    }
}