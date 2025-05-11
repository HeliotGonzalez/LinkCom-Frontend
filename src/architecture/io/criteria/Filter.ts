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
        if (!field || !operator || !value) throw new Error('Invalid filter');
        return new Filter(field, FilterOperator.fromValue(operator), value);
    }

    static buildOrFrom(filters: Filters) {
        const value: string[] = [];
        filters.getFilters().forEach(f => {
            console.log(f.getOperator().toString());
            value.push(`${f.getField()}.${f.getOperator()}.${f.getValue()}`)
        });
        return new Filter('', FilterOperator.fromValue('or'), value.join(','));
    }

    public getField() {
        return this.field;
    }

    public getOperator() {
        return this.operator.getValue();
    }

    public getValue() {
        return this.value;
    }
}