import {StructPrint} from "../interfaces";

 export class Container implements StructPrint {
    constructor(image: string, registry?: string) {


    }

    env(socketUrl: string, zmqPort: string) {

    }

    setEnv(param: { [key: string]: string }) {

    }

    export(): object {
        return undefined;
    }
}