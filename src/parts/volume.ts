import { Builder } from "src/interfaces";
import { VolumeType } from "src/structs";


export class Volume extends Builder<VolumeType> {
    init(): VolumeType {
        throw new Error("Method not implemented.");
    }

    constructor(private name: string,private path: string) {
        super()
    }

}