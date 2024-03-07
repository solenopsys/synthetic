import * as fs from "fs";
import {Deploy} from "./deploy";
import {exportToHelmFormat} from "./generator";

const listExamples = fs.readdirSync("./examples");

for (let i = 0; i < listExamples.length; i++) {
    const example = listExamples[i];
    const name = example.substring(0, example.lastIndexOf("."));
    import("../examples/" + listExamples[0]+"/script.ts").then((module) => {
        console.log("IMPORT",name)
        let manage:Deploy = module.dp;
        exportToHelmFormat(manage, "./helm/"+name);
    })
}



console.log(listExamples);