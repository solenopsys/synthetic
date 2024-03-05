import { StructPrint } from "../interfaces";
import type { Port } from "./intfs";

export class Container implements StructPrint {
    constructor(name: string, image: string, registry?: string) {


    }

    env(socketUrl: string, zmqPort: string) {

    }

    setEnv(param: { [key: string]: string }) {

    }

    export(): object {
        return undefined;
    }

    addPort(port: Port): Container {
        // return this.newPort(port.name, port.port)
    }

    mountVolume(volume: Volume, mountPath: string, subPath?: string, readOnly?: boolean) {

     
    }
}