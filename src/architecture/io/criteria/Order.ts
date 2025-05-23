import {OrderBy} from "./OrderBy";
import {OrderType, OrderTypes} from "./OrderType";

export class Order {
    private readonly orderBy: OrderBy;
    private readonly orderType: OrderType;

    constructor(orderBy: OrderBy, orderType: OrderType) {
        this.orderBy = orderBy;
        this.orderType = orderType;
    }

    public getOrderBy() {
        return this.orderBy;
    }

    public getOrderType() {
        return this.orderType;
    }

    static fromValues(orderBy?: string, orderType?: string): Order {
        if (!orderBy) {
            return Order.none();
        }

        return new Order(new OrderBy(orderBy), OrderType.fromValue(orderType || OrderTypes.ASC));
    }

    static none(): Order {
        return new Order(new OrderBy(''), new OrderType(OrderTypes.NONE));
    }

    static desc(orderBy: string): Order {
        return new Order(new OrderBy(orderBy), new OrderType(OrderTypes.DESC));
    }

    static asc(orderBy: string): Order {
        return new Order(new OrderBy(orderBy), new OrderType(OrderTypes.ASC));
    }
}