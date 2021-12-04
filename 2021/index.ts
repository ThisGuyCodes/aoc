import { createReadStream } from "fs";
import { createInterface } from "readline";

import { first as oneFirst, second } from "./01/index";
import { second as oneSecond } from "./01/index";

import { first as twoFirst } from "./02/index";
import { second as twoSecond } from "./02/index";

import { first as threeFirst } from "./03/index";
import { second as threeSecond } from "./03/index";

import { first as fourFirst } from "./04/index";
import { second as fourSecond } from "./04/index";

const getDataInterface = async function(path: string) {
    const dataStream = await createReadStream(path);
    const data = createInterface({
        input: dataStream
    });

    return data;
};

(async function() {
    const firstData = await getDataInterface("./01/data.txt");
    const firstResult = await oneFirst(firstData);
    console.log(firstResult);

    const secondData = await getDataInterface("./01/data.txt");
    const secondResult = await oneSecond(secondData);
    console.log(secondResult);
});

(async function() {
    const firstData = await getDataInterface("./02/data.txt");
    const firstResult = await twoFirst(firstData);
    console.log(firstResult);

    const secondData = await getDataInterface("./02/data.txt");
    const secondResult = await twoSecond(secondData);
    console.log(secondResult);
});

(async function() {
    const firstData = await getDataInterface("./03/data.txt");
    const firstResult = await threeFirst(firstData);
    console.log(firstResult);

    const secondData = await getDataInterface("./03/data.txt");
    const secondResult = await threeSecond(secondData);
    console.log(secondResult);
})();

(async function() {
    const firstData = await getDataInterface("./04/data.txt");
    const firstResult = await fourFirst(firstData);
    console.log(firstResult);

    const secondData = await getDataInterface("./04/data.txt");
    const secondResult = await fourSecond(secondData);
    console.log(secondResult);
})();