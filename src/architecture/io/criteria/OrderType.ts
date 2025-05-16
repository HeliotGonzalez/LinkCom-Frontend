export enum OrderTypes {
    ASC = 'asc',
    DESC = 'desc',
    NONE = 'none'
}

export class OrderType {
    private readonly value: OrderTypes;

    constructor(value: OrderTypes) {
        this.value = value;
    }

    public getValue() {
        return this.value;
    }

    static fromValue(value: string): OrderType {
        for (const orderTypeValue of Object.values(OrderTypes))
            if (value === orderTypeValue.toString()) return new OrderType(orderTypeValue);
        throw new Error('Invalid order type');
    }
}