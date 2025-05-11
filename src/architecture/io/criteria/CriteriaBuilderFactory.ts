import {Filters} from "./Filters";
import {Order} from "./Order";
import {Criteria} from "./Criteria";

interface Builder {
    build(filters: Filters, order: Order, limit?: number, offset?: number): Criteria;
}

interface Selector {
    build(name: string): Criteria;
}

export class CriteriaBuilderFactory {
    private builders: {[key: string]: Builder} = {};

    public register(name: string, builder: Builder){
        this.builders[name] = builder;
        return this;
    }

    public with(filters: Filters, order: Order, limit?: number, offset?: number): Selector {
        return {
            build: (name: string) => this.builders[name].build(filters, order, limit, offset)
        }
    }
}