import { createReadStream } from "fs";
import { createInterface } from "readline";

import { first as oneFirst, second } from "./01/index";
import { second as oneSecond } from "./01/index";

import { first as twoFirst } from "./02/index";
import { second as twoSecond } from "./02/index";

async function getDataInterface(path: string) {
    const dataStream = await createReadStream(path);
    const data = createInterface({
        input: dataStream
    });

    return data;
}

(async function() {
    const firstData = await getDataInterface("./01/data.txt");
    const firstResult = await oneFirst(firstData);
    console.log(firstResult);

    const secondData = await getDataInterface("./01/data.txt");
    const secondResult = await oneSecond(secondData);
    console.log(secondResult);
})();

(async function() {
    const firstData = await getDataInterface("./02/data.txt");
    const firstResult = await twoFirst(firstData);
    console.log(firstResult);

    const secondData = await getDataInterface("./02/data.txt");
    const secondResult = await twoSecond(secondData);
    console.log(secondResult);
})();