import type { StructPrint } from "./interfaces";
import { Service } from "./model";
import { Deployment } from "./model/deployment";
import { LoadBalancer } from "./model/loadbalancer";
import { Role } from "./model/role";

export type ChartConf = {
    name: string,
    version: string,
    description: string
}

export class Deploy implements StructPrint {
    items: any[] = [];
    result: any;

    constructor(public config: ChartConf) {
    }

    add(obj: any) {
        this.items.push(obj);
    }

    export(): object {
        return {
            "apiVersion": "v2",
            "name": this.config.name,
            "version": this.config.version,
            "description": this.config.description,
            "icon": `/icons/${this.config.name}.svg`,
            "appVersion": "1.0.0"
        };
    }

    exportItem(object: { export: () => void }, prefix: string) {
        const name = "templates/" + prefix + "-" + object.constructor.name;
        this.result[name] = object.export()
    }

    processItem(obj: any) {

        if (obj instanceof LoadBalancer)
            this.exportItem(obj, "loadbalancer")
        else if (obj instanceof Service)
            this.exportItem(obj, "service")
        else if (obj instanceof Role)
            this.exportItem(obj, "role")
        else if (obj instanceof Deployment)
            this.exportItem(obj, "deployment")
    }

    exportStruct(): { [name: string]: object } {
        this.result = {}

        this.result['chart'] = this.export()

        for (let i = 0; i < this.items.length; i++) {
            console.log("ITEM: ", i)
            this.processItem(this.items[i])
        }
        return this.result;
    }




}
