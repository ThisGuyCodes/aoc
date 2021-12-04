import { listenerCount } from "process";

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

type bits = Array<boolean>;

export async function second(data: AsyncIterable<string>) {
    let allData: Array<bits> = [];
    const diags = await parseDiag(data);
    for await (const diag of diags) {
        const theseBits = diag.toString(2);
        const leftPad = "0".repeat(bitWidth - theseBits.length);
        const paddedBits = (leftPad + theseBits).split("").map(BigInt).map(Boolean);
        allData.push(paddedBits);
    }
    let coScrubCandidates = [...allData];
    let oxGenCandidates = [...allData];

    allData[0].forEach((_, bitNum) => {
        if (oxGenCandidates.length > 1) {
            const oneCount = oxGenCandidates.map((candidate) => {
                return BigInt(candidate[bitNum]);
            }).reduce((previous, current) => previous + current);
            const acceptedBit = (oneCount >= oxGenCandidates.length / 2);
            oxGenCandidates = oxGenCandidates.filter((candidate) => {
                return (candidate[bitNum] === acceptedBit);
            });
        };
        if (coScrubCandidates.length > 1) {
            const oneCount = coScrubCandidates.map((candidate) => {
                return BigInt(candidate[bitNum]);
            }).reduce((previous, current) => previous + current);
            const acceptedBit = (oneCount < coScrubCandidates.length / 2);
            coScrubCandidates = coScrubCandidates.filter((candidate) => {
                return (candidate[bitNum] === acceptedBit);
            });
        };
    });

    const oxGenString = oxGenCandidates[0].map(Number).map((a) => a.toString()).reduce((a,b) => a+b);
    const coScrubString = coScrubCandidates[0].map(Number).map((a) => a.toString()).reduce((a,b) => a+b);
    return BigInt("0b" + oxGenString) * BigInt("0b" + coScrubString);
}