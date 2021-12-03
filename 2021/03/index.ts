const parseDiag = async function*(data: AsyncIterable<string>) {
    for await (const line of data) {
        yield BigInt("0b" + line);
    }
}

class Counts {
    zeros: bigint = 0n;
    ones: bigint = 0n;
}
const bitWidth = 12;

export async function first(data: AsyncIterable<string>) {
    let bitCounts: Array<Counts> = [];
    for (let i=0; i<bitWidth; i++) {
        bitCounts.push(new Counts());
    }

    const diags = await parseDiag(data);
    for await (const diag of diags) {
        for (let i=0; i<bitWidth; i++) {
            const bit = (diag >> BigInt(i)) & 1n;
            switch (bit) {
                case 0n:
                    bitCounts[i].zeros += 1n;
                    break;
                case 1n:
                    bitCounts[i].ones += 1n;
                    break;
            }
        }
    }

    let gammaRate: bigint = 0n;
    for (let i=0; i<bitWidth; i++) {
        if (bitCounts[i].ones > bitCounts[i].zeros) {
            gammaRate += (1n << BigInt(i));
        }
    }

    let epsilonRate = gammaRate;
    for (let i=0; i<bitWidth; i++) {
        epsilonRate ^= (1n << BigInt(i))
    }
    return gammaRate * epsilonRate;
}

export async function second(data: AsyncIterable<string>) {
}