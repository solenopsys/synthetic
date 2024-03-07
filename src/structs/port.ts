export type Port = {
    port: number;
    name: string;
}

export type PortLink = {
    targetPort?: number;
} | Port

