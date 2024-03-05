export interface Port {
    port: number;
    name: string;
    targetPort: number;
}

export enum ServiceTypes {
    LoadBalancer="LoadBalancer",
    Service="Service"
}

export interface ServiceSpec {
    ports: Port[];
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

export interface ServiceIntf {
    apiVersion: 'v1';
    kind: 'Service';
    metadata: ServiceMetadata;
    spec?: ServiceSpec;
}