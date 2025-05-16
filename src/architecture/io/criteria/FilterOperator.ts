export enum Operator {
    EQUAL = 'eq',
    NOT_EQUAL = 'neq',
    GT = 'gt',
    LT = 'lt',
    CONTAINS = 'in',
    NOT_CONTAINS = 'nin',
    OR = 'or'
}

export class FilterOperator {
    private readonly value: Operator;

    constructor(value: Operator) {
        this.value = value;
    }

    static fromValue(value: string): FilterOperator {
        for (const operatorValue of Object.values(Operator))
            if (value === operatorValue.toString()) return new FilterOperator(operatorValue);

        throw new Error('Invalid operator');
    }

    public getValue() {
        return this.value;
    }

    static equal() {
        return this.fromValue(Operator.EQUAL);
    }
}