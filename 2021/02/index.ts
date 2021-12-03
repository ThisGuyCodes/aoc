export enum Direction {
    Forward,
    Down,
    Up,
}

export interface Command {
    direction: Direction;
    distance: number;
}

const parseCommands = async function*(data: AsyncIterable<string>): AsyncIterable<Command> {
    for await (const line of data) {
        let parts = line.split(" ");
        let direction = function(): Direction {
            switch(parts[0]) {
                case "forward": {
                    return Direction.Forward;
                }
                case "down": {
                    return Direction.Down;
                }
                case "up": {
                    return Direction.Up;
                }
            };
        }();
        let distance = parseInt(parts[1]);
        yield { direction, distance };
    }
}

export async function first(data: AsyncIterable<string>) {
    let xPos = 0;
    let depth = 0;

    const commands = await parseCommands(data);
    for await (const command of commands) {
        switch (command.direction) {
            case Direction.Forward:
                xPos += command.distance;
                break;
            case Direction.Down:
                depth += command.distance;
                break;
            case Direction.Up:
                depth -= command.distance;
                break;
        }
    }

    return xPos * depth;
};

export async function second(data: AsyncIterable<string>) {
    let xPos = 0;
    let depth = 0;
    let aim = 0;
    
    const commands = await parseCommands(data);
    for await (const command of commands) {
        switch (command.direction) {
            case Direction.Forward:
                xPos += command.distance;
                depth += aim * command.distance;
                break;
            case Direction.Down:
                aim += command.distance;
                break;
            case Direction.Up:
                aim -= command.distance;
                break;
        }
    }

    return xPos * depth;
};