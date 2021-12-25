class Display {
    patterns: Array<Pattern>;
    values: Array<Pattern>;

    constructor(line: string) {
        const [patternsString, valuesString] = line.split("|");
        this.patterns = patternsString.trim().split(" ").map(pattern => new Pattern(pattern));
        this.values = valuesString.trim().split(" ").map(value => new Pattern(value));
    }
}

class Pattern extends Map<string, boolean> {
    constructor(pattern: string) {
        super();
        pattern
            .split("")
            .forEach(segment => this.set(segment, true));
    }
}

const parseData = async function(data: AsyncIterable<string>): Promise<Array<Display>> {
    let displays = new Array<Display>();
    for await (const line of data) {
        displays.push(new Display(line));
    };
    return displays;
}

export async function first(data: AsyncIterable<string>) {
    const countableSizes = [2, 4, 3, 7];
    const displays = await parseData(data);

    return displays
        .flatMap(display => display.values)
        .filter(pattern => countableSizes.includes(pattern.size))
        .length;
}

export async function second(data: AsyncIterable<string>) {
    return ""
}