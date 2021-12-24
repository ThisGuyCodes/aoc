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

const runDay = async function(day: number, first: (data: AsyncIterable<string>) => Promise<any>, second: (data: AsyncIterable<string>) => Promise<any>) {
    const dayString = day.toString().padStart(2, '0');
    const dataLoc = `./${dayString}/data.txt`;

    const firstData = await getDataInterface(dataLoc);
    const firstResult = await first(firstData);
    console.log(`Day ${dayString}a: ${firstResult}`)

    const secondData = await getDataInterface(dataLoc);
    const secondResult = await second(secondData);
    console.log(`Day ${dayString}b: ${secondResult}`)
};
(async function() {
    let day = 1;
    await runDay(day, oneFirst, oneSecond);

    day++;
    await runDay(day, twoFirst, twoSecond);

    day++;
    await runDay(day, threeFirst, threeSecond);

    day++;
    await runDay(day, fourFirst, fourSecond);
})();