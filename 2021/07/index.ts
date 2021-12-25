const parseData = async function(data: AsyncIterable<string>): Promise<Array<Crab>> {
    for await (const line of data) {
        return line.split(",").map(num => parseInt(num)).map(num => new Crab(num));
    }
}

class Crab {
    pos: number;

    constructor(pos: number) {
        this.pos = pos;
    }

    distanceTo(pos: number): number {
        return Math.abs(pos - this.pos);
    }
}

const totalFuel = function(crabs: Array<Crab>, pos: number): number {
    return crabs.map(crab => crab.distanceTo(pos)).reduce((left, right) => left + right)
}

export async function first(data: AsyncIterable<string>) {
    const crabs = await parseData(data);

    const min = Math.min(...crabs.map(crab => crab.pos));
    const max = Math.max(...crabs.map(crab => crab.pos));

    let winner = [min, totalFuel(crabs, min)];
    for (let pos=min; pos <= max; pos++) {
        const candidate = [pos, totalFuel(crabs, pos)];
        if (candidate[1] < winner[1]) {
            winner = candidate;
        };
    };
    return winner[1]; 
}

export async function second(data: AsyncIterable<string>) {
    return ""
}