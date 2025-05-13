import {Filters} from "./Filters";
import {Order} from "./Order";

export class Criteria {
    private readonly filters: Filters;
    private readonly order?: Order;
    private readonly limit?: number;
    private readonly offset?: number;

    constructor(filters: Filters, order?: Order, limit?: number, offset?: number) {
        this.filters = filters;
        this.order = order;
        this.limit = limit;
        this.offset = offset;
    }

    public getFilters() {
        return this.filters;
    }

    public getOrder() {
        return this.order;
    }

    public getLimit() {
        return this.limit;
    }

    public getOffset() {
        return this.offset;
    }
}