export interface Command {
    direction: string;
    distance: number;
}

export async function first(data: AsyncIterable<string>) {
    let xPos = 0;
    let depth = 0;

    const commands = async function*(): AsyncGenerator<Command, void, void> {
        for await (const line of data) {
            let parts = line.split(" ");
            let direction = parts[0];
            let distance = parseInt(parts[1]);
            yield { direction, distance };
        }
    }();

    
};

export async function second(data: AsyncIterable<string>) {

};