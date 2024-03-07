export type VolumeMetadataType = {
    name: string;
}

export type VolumeSpecType = {
    name: string;
    configMap?: string;
    secret?: string;
    hostPath?: string;
    emptyDir?: string;
    gcePersistentDisk?: string;
    nfs?: string;
    iscsi?: string;
    flexVolume?: string;
}

export type VolumeType = {
    apiVersion: 'v1';
    kind: 'Volume';
    metadata: VolumeMetadataType;
    spec?: VolumeSpecType;
}