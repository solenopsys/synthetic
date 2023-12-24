import {StructPrint} from "./interfaces";
import {Deployment} from "./model/deployment";
import {Role} from "./model/role";

export type ChartConf = {
    name: string,
    version: string,
    description: string
}

export class Manage implements StructPrint {
    deployments: Deployment[] = [];
    roles: Role[] = [];

    constructor(public config: ChartConf) {
    }

    addDeployment(deployment: any) {
        this.deployments.push(deployment);
    }

    addRole(role: Role) {
        this.roles.push(role);
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

    arrayExport(prefix: string, exp: { [name: string]: object }, obj: StructPrint[]): any {
        for (let i = 0; i < obj.length; i++) {
            const o = obj[i];
            const name = "templates/"+prefix + "-" + o.constructor.name;

            exp[name] = o.export();
        }
    }

    exportStruct(): { [name: string]: object } {
        const result = {}
        result['chart'] = this.export()
        this.arrayExport("deployment", result, this.deployments)
        this.arrayExport("role", result, this.roles)
        return result;
    }
}
