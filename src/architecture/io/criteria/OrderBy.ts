export class OrderBy {
    private readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    public getValue() {
        return this.value;
    }
}