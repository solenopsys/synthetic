import {dump} from "js-yaml";
import {mkdirSync, writeFileSync} from "fs";
import {Chart} from "./chart";

export const REGISTRY_SOLENOPSYS = "registry.solenopsys.org";

export function dumpToYaml(obj: any, file) {
    const yamlString = dump(obj);
    writeFileSync(file, yamlString, 'utf-8');
}

export function generate(chart: Chart) {
    const distFolder = "dist";
    mkdirSync(distFolder);
    let arr = chart.exportStruct();
    console.log(arr);

    for (let key in arr) {
        let file = `${key}.yaml`;
        dumpToYaml(arr[key], file);
    }
}