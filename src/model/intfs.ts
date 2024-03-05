
export interface Port {
    port: number;
    name: string;
}

export interface PortLink extends Port{

    targetPort?: number;
}

export enum ServiceTypes {
    LoadBalancer = "LoadBalancer",
    Service = "Service"
}

export interface ServiceSpec {
    ports: PortLink[];
    selector: {
        app: string;
    };
    type: ServiceTypes;
}

export interface ServiceMetadata {
    labels: {
        app: string;
    };
    name: string;
}


export type ServiceIntf = {
    apiVersion: 'v1';
    kind: 'Service';
    metadata: ServiceMetadata;
    spec?: ServiceSpec;
}

export const KB = 1024
export const MB = KB * KB
export const GB = KB * KB * KB
export const TB = MB * MB