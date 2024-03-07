import { ContainerType, Port } from "src/structs";
import { Builder } from "../interfaces";
import { VolumeClaim } from "./volumeclaim";
import { HostPath } from "./hostpath";

export class Container extends Builder<ContainerType> {
    constructor(private name: string, private image: string, private registry?: string) {
        super()
    }

    getName(): string {
        return this.name
    }

    init(): ContainerType {
        return {
            name: this.name,
            image: this.registry ? this.registry : "" + this.image,
            env: {},
            ports: [],
            volumeMounts: []
        }
    }

    env(name: string, value: string) {
        this.conf.env[name] = value
    }

    addPort(port: Port): Container {
        this.conf.ports.push(port)
        return this
    }

    mountVolume(volume: VolumeMount, mountPath: string, subPath?: string, readOnly?: boolean) {

        if(volume instanceof VolumeClaim){
            this.conf.volumeMounts.push({
                name: volume.getName(),
                mountPath: mountPath
            })
        } else if (volume instanceof HostPath) {
            this.conf.volumeMounts.push({
                name: volume.getName(),
                mountPath: mountPath,
                subPath: subPath,
                readOnly: readOnly
            })
        }
       
    }
}