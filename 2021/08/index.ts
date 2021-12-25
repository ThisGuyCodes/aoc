import { exec } from "child_process";

class Display {
    patterns: Array<Pattern>;
    values: Array<Pattern>;

    constructor(line: string) {
        const [patternsString, valuesString] = line.split("|");
        this.patterns = patternsString.trim().split(" ").map(pattern => new Pattern(pattern));
        this.values = valuesString.trim().split(" ").map(value => new Pattern(value));
    };

    applyConstraints(): Array<string> {
        // first pass
        let oneKnown: Pattern; // size === 2
        let fourKnown: Pattern; // size === 4
        let sevenKnown: Pattern; // size === 3
        let eightKnown: Pattern; // size === 7

        // second pass
        let zeroKnown: Pattern; // size === 6 && shares 2 with one && shares 3 with four
        let twoKnown: Pattern; // size === 5 && shares 2 with four
        let threeKnown: Pattern; // size === 5 && shares 2 with one
        let fiveKnown: Pattern; // size === 5 && shares 1 with one && shares 3 with four
        let sixKnown: Pattern; // size === 6 && shares 1 with one
        let nineKnown: Pattern; // size === 6 && shares 4 with four


        for (const pattern of this.patterns) {
            if (pattern.size === 2) {
                oneKnown = pattern;
            };
            if (pattern.size === 4) {
                fourKnown = pattern;
            };
            if (pattern.size === 3) {
                sevenKnown = pattern;
            };
            if (pattern.size === 7) {
                eightKnown = pattern;
            };
        };

        for (const pattern of this.patterns) {
            if (pattern.size === 6 && pattern.shares(oneKnown) === 2 && pattern.shares(fourKnown) === 3) {
                zeroKnown = pattern;
            };
            if (pattern.size === 5 && pattern.shares(fourKnown) === 2) {
                twoKnown = pattern;
            };
            if (pattern.size === 5 && pattern.shares(oneKnown) === 2) {
                threeKnown = pattern;
            };
            if (pattern.size === 5 && pattern.shares(oneKnown) === 1 && pattern.shares(fourKnown) === 3) {
                fiveKnown = pattern;
            };
            if (pattern.size === 6 && pattern.shares(oneKnown) === 1) {
                sixKnown = pattern;
            };
            if (pattern.size === 6 && pattern.shares(fourKnown) === 4) {
                nineKnown = pattern;
            };
        };

        return [zeroKnown, oneKnown, twoKnown, threeKnown, fourKnown, fiveKnown, sixKnown, sevenKnown, eightKnown, nineKnown].
            map(set => set.toString());
    };

    getValue(solutions: Array<string>): number {
        const stringValue = this.values.
            map(value => solutions.indexOf(value.toString())).
            join("");
        return parseInt(stringValue);
    }
};

class Pattern extends Set<string> {
    constructor(pattern: string) {
        super();
        pattern
            .split("")
            .forEach(segment => this.add(segment));
    };

    shares(pattern: Pattern): number {
        return [...this.values()].
            filter(segment => pattern.has(segment)).
            length;
    };

    toString(): string {
        const values = [...this.values()];
        values.sort();
        return values.join();
    }
};

const parseData = async function(data: AsyncIterable<string>): Promise<Array<Display>> {
    let displays = new Array<Display>();
    for await (const line of data) {
        displays.push(new Display(line));
    };
    return displays;
}

export async function first(data: AsyncIterable<string>): Promise<number> {
    const countableSizes = [2, 4, 3, 7];
    const displays = await parseData(data);

    return displays
        .flatMap(display => display.values)
        .filter(pattern => countableSizes.includes(pattern.size))
        .length;
}

export async function second(data: AsyncIterable<string>): Promise<number> {
    const displays = await parseData(data);

    return displays.map(display => {
        const solutions = display.applyConstraints();
        return display.getValue(solutions);
    }).reduce((left, right) => left + right);
}