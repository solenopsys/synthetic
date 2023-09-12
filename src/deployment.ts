import {StructPrint} from "./interfaces";
import {Container} from "./container";

export class Deployment implements StructPrint {
    constructor(name: string, containers: Container[]) {
    }

    export(): object {
        return {};
    }
}