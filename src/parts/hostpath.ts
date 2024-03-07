 
import { VolumeClaim } from "./volumeclaim";
import { VolumeMount } from "./volumemount";

export class HostPath implements VolumeMount {

    constructor(claim: VolumeClaim, path: string) {
    }
   
     

}