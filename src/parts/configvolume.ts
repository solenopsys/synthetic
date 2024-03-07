import { ConfigMap } from "..";
import {  VolumeMetadata, VolumeSpecType, VolumeType } from "../structs";
import { VolumeMount } from "./volumemount";

export class ConfigVolume implements VolumeMount {
    constructor(configMap: ConfigMap, keyName: string) {

    }

}