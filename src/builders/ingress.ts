import { IngressType, PortType } from "src/structs";
import { Builder, StructPrint } from "../interfaces";
import { DEFAULTS } from "src/defaults";
import { Service } from "./servises/service";

export class Ingress extends Builder<IngressType> {
    getName(): string {
        return this.name
    }

    constructor(private name: string) {
        super()
    }


    init(): IngressType {
        return DEFAULTS.INGRESS(this.name)
    }


    addDomain(host: string, service: Service, port: PortType, prefix?: string) {
        const pref = prefix ? prefix : "/"
        const h = this.genHost(service.getName(), { service: service.getName(), prefix: pref, port: port.port });
        super.conf.spec.rules.push(h)
        super.conf.spec.tls.push(this.genTls(host))
    }


    private genTls(host: string) {
        return {
            hosts: [host],
            secretName: 'ssl-secret' + host.replace(/\./g, '-')
        };
    }

    private genHost(host: string, mapping: { service: string; prefix: string; port: number }) {
        return {
            host: host,
            http: {
                paths: [
                    {
                        path: mapping.prefix,
                        pathType: 'Prefix',
                        backend: {
                            service: {
                                name: mapping.service,
                                port: {
                                    number: mapping.port
                                }
                            }
                        }
                    }
                ]
            }
        };
    }
}