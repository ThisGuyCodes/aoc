class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    };

    toString(): string {
        return `${this.x},${this.y}`
    };

    *to(point: Point): Iterable<Point> {
        let changeProp: string;
        let unchanged: number;
        let changeFrom: number;
        let changeTo: number;

        if (this.x === point.x) {
            changeProp = "y";
            unchanged = this.x;
            changeFrom = this.y;
            changeTo = point.y;
        } else {
            changeProp = "x";
            unchanged = this.y;
            changeFrom = this.x;
            changeTo = point.x;
        };
        
        if (changeFrom > changeTo) {
            [changeFrom, changeTo] = [changeTo, changeFrom];
        };

        for (let changing = changeFrom; changing <= changeTo; changing++) {
            if (changeProp === "y") {
                yield new Point(unchanged, changing);
            } else {
                yield new Point(changing, unchanged);
            };
        };
    };
}

class Vent {
    start: Point;
    end: Point;

    constructor(start: Point, end: Point) {
        [this.start, this.end] = [start, end];
    };

    isHorizontal(): boolean {
        return this.start.x === this.end.x;
    };

    isVertical(): boolean {
        return this.start.y === this.end.y;
    };
};

class VentMap extends Map<string, number> {
    default: number = 0;
    get(key: string): number {
        if (!this.has(key)) {
            return this.default;
        };
        return super.get(key);
    };

    plotVent(vent: Vent) {
        for (const point of vent.start.to(vent.end)) {
            this.set(point.toString(), this.get(point.toString()) + 1);
        }
    }
}

const parseData = async function(data: AsyncIterable<string>): Promise<Array<Vent>> {
    const ret = new Array<Vent>();
    for await (const line of data) {
        const [startX, startY, endX, endY] = line.split(' -> ').flatMap(pair => pair.split(',').map(num => parseInt(num)));
        const start = new Point(startX, startY);
        const end = new Point(endX, endY);

        ret.push(new Vent(start, end));
    };

    return ret;
};

export async function first(data: AsyncIterable<string>) {
    const map = new VentMap();
    const parsed = await parseData(data);
    const viable = parsed.filter(vent => vent.isVertical() || vent.isHorizontal());
    viable.forEach(vent => map.plotVent(vent));
    return [...map.values()].filter(count => count > 1).length
};

export async function second(data: AsyncIterable<string>) {
    return ""
};