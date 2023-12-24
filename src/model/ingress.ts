import {StructPrint} from "../interfaces";

export class Ingress implements StructPrint {
    name: string
    hosts: { [host: string]: { service: string, prefix: string, port: string } } = {};
    readonly annotations: { [key: string]: string } = {
        'kubernetes.io/ingress.class': 'traefik',
        'cert-manager.io/cluster-issuer': 'zerossl-production',
        'cert-manager.io/acme-challenge-type': 'dns01',
        'cert-manager.io/acme-dns01-provider': 'route53',
        'ingress.kubernetes.io/force-hsts': 'true',
        'ingress.kubernetes.io/hsts-preload': 'true',
        'ingress.kubernetes.io/ssl-redirect': 'true',
        'ingress.kubernetes.io/enable-cors': 'true'
    };

    service


    export(): object {

        const rules = []
        for (let host in this.hosts)
            rules.push(this.genHost(host, this.hosts[host]))

        const tls = []
        for (let host in this.hosts)
            tls.push(this.genTls(host))

        return {
            apiVersion: 'networking.k8s.io/v1',
            kind: 'Ingress',
            metadata: {
                name: this.name,
                annotations: this.annotations
            },
            spec: {
                tls: tls,
                rules: rules
            }
        }
    }


    private genTls(host: string) {
        return {
            hosts: [host],
            secretName: 'ssl-secret' + host.replace(/\./g, '-')
        };
    }

    private genHost(host: string, mapping: { service: string; prefix: string; port: string }) {
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
                                    number: parseInt(mapping.port)
                                }
                            }
                        }
                    }
                ]
            }
        };
    }
}