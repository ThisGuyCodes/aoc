export async function first(data: AsyncIterable<string>) {
    const depthReadings = async function* (): AsyncGenerator<number, void, void> {
        for await (const line of data) {
            yield parseInt(line);
        }
    }();

    let increasingCount = 0;
    let previous = <Number> (await depthReadings.next()).value;
    for await (const current of depthReadings) {
        if (current > previous) {
            increasingCount++;
        }
        previous = current;
    }

    return increasingCount;
}

export async function second(data: AsyncIterable<string>) {
    const depthReadings = async function* () {
        for await (const line of data) {
            yield parseInt(line);
        }
    }();

    let increasingCount = 0;
    let previousWindow = [0, 0, 0];
    let currentWindow = [0, 0, 0];
    for await (const current of depthReadings) {
        currentWindow = previousWindow.slice(1, 3).concat([current]);
        if (!previousWindow.includes(0)) {
            const currentSum = currentWindow.reduce((a, b) => a + b);
            const previousSum = previousWindow.reduce((a, b) => a + b);
            if (currentSum > previousSum) {
                increasingCount++;
            }
        }
        previousWindow = currentWindow;
    }
    return increasingCount;
}