interface BingoSpot {
    value: number;
    marked: boolean;
}

class BingoBoard {
    width: number = 5;
    height: number = 5;
    contents: Array<BingoSpot>;

    constructor(raw: string) {
        this.contents = raw.split("\n")
            .map((line) => line.split(" "))
            .flat()
            .filter((spot) => {
                return spot !== "";
            })
            .map((spot): BingoSpot => {
                return {
                    value: parseInt(spot),
                    marked: false,
                };
            });
    };

    rows(): Array<Array<BingoSpot>> {
        return this.contents.reduce((rows, spot, index) => {
            const chunkIndex = Math.floor(index/this.width);
            
            if(!rows[chunkIndex]) {
                rows[chunkIndex] = []; // start a new chunk
            }
            
            rows[chunkIndex].push(spot);
            
            return rows;
        }, Array<Array<BingoSpot>>());
    };

    columns(): Array<Array<BingoSpot>> {
        const rows = this.rows();
        return rows[0].map((spot, colNum) => {
            return rows.map((row) => {
                return row[colNum];
            })
        });
    }

    spotAt(x: number, y: number): BingoSpot {
        return this.contents[this.width * y + x];
    };

    won(): boolean {
        const rows = this.rows();
        const columns = this.columns();

        const rowWon = rows.some((row) => {
            return row.map((spot) => spot.marked).every((marked) => marked);
        });

        const columnWon = columns.some((column) => {
            return column.map((spot) => spot.marked).every((marked) => marked);
        });

        return rowWon || columnWon;
    };

    score(): number {
        return this.contents
            .filter(spot => !spot.marked)
            .map(spot => spot.value)
            .reduce((a, b) => a + b);
    };

    find(num: number): Array<BingoSpot> {
        return this.contents.filter(spot => spot.value === num);
    }

    mark(num: number): void {
        this.find(num).forEach(spot => {
            spot.marked = true;
        });
    }
}

const parseInput = async function(data: AsyncIterable<string>): Promise<[Array<number>, Array<BingoBoard>]> {
    let rawData: Array<string> = [];
    for await (const line of data) {
        rawData.push(line);
    };
    const numbers = rawData.shift()
        .split(",")
        .map(i => parseInt(i));
    const bingoBoards = rawData.join("\n")
        .split("\n\n")
        .filter((board) => board !== "")
        .map((board) => new BingoBoard(board));

    return [numbers, bingoBoards];
}

export async function first(data: AsyncIterable<string>): Promise<number> {
    const [numbers, boards] = await parseInput(data);

    for (const num of numbers) {
        boards.forEach(board => {
            board.mark(num);
        });
        const winners = boards.filter(board => board.won());
        if (winners.length > 0) {
            return winners[0].score() * num;
        }
    }

    return NaN;
}

export async function second(data: AsyncIterable<string>) {
    const [numbers, boards] = await parseInput(data);

    let remaining = boards;
    for (const num of numbers) {
        remaining.forEach(board => {
            board.mark(num);
        });
        if (remaining.length === 1) {
            if (remaining[0].won()) {
                return remaining[0].score() * num;
            }
        }
        remaining = remaining.filter(board => !board.won());
    }

    return NaN;
}