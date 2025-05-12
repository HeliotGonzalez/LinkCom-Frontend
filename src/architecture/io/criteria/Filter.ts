import {FilterOperator} from "./FilterOperator";
import {FilterInterface, Filters} from "./Filters";

export class Filter {
    private readonly field: string;
    private readonly operator: FilterOperator;
    private readonly value: any;

    constructor(field: string, operator: FilterOperator, value: any) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }

    static fromValues(values: FilterInterface): Filter {
        const field = values.field;
        const operator = values.operator;
        const value = values.value;
        if (!field || !operator || !value) throw new Error(`Invalid filter: ${field}.${operator}.${value}`);
        return new Filter(field, FilterOperator.fromValue(operator), value);
    }

    public getField() {
        return this.field;
    }

    public getOperator() {
        return this.operator;
    }

    public getValue() {
        return this.value;
    }
}