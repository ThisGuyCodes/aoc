const parseData = async function(data: AsyncIterable<string>): Promise<Array<number>> {
    for await (const line of data) {
        return line.split(",").map(num => parseInt(num));
    };
}

class School extends Map<number, number> {
    default: number = 0;
    get(key: number): number {
        if (!this.has(key)) {
            return this.default;
        };
        return super.get(key);
    };

    total(): number {
        return [...this.values()]
            .reduce((left, right) => left + right);
    };

    simulateDay() {
        const newSchool = new School();
        for (const group of this.keys()) {
            if (group === 0) {
                newSchool.set(6, newSchool.get(6) + this.get(group));
                newSchool.set(8, newSchool.get(8) + this.get(group));
            } else {
                newSchool.set(group - 1, newSchool.get(group - 1) + this.get(group));
            };
        };

        this.clear();

        newSchool.forEach((value, key) => this.set(key, value));
    };

    simulateDays(n: number) {
        for (let i=0; i < n; i++) {
            this.simulateDay();
        };
    };

    populate(school: Iterable<number>) {
        for (const fish of school) {
           this.set(fish, this.get(fish) + 1);
        }
    }
}

export async function first(data: AsyncIterable<string>) {
    const parsed = await parseData(data);

    const school = new School();
    school.populate(parsed);

    school.simulateDays(80);

    return school.total();
}

export async function second(data: AsyncIterable<string>) {
    const parsed = await parseData(data);

    const school = new School();
    school.populate(parsed);

    school.simulateDays(256);

    return school.total();
}