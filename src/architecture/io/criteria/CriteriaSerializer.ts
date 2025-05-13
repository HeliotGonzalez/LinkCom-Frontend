import {Criteria} from "./Criteria";
import {Filter} from "./Filter";
import {FilterGroup} from "./FilterGroup";
import {Order} from "./Order";

export class CriteriaSerializer {
    static serialize(criteria: Criteria) {
        const raw = {
            filters: this.buildFiltersFrom(criteria.getFilters().getFilters()),
            order: this.buildOrderFrom(criteria.getOrder()),
            limit: criteria.getLimit(),
            offset: criteria.getOffset()
        };

        const json = JSON.stringify(raw);
        return btoa(json);
    }

    private static buildFiltersFrom(filters: (Filter | FilterGroup)[]) {
        return filters.map(f => 'logic' in f ?
                {logic: f.getLogic(), filters: f.getFilters()} :
                {field: f.getField(), operator: f.getOperator(), value: f.getValue()});
    }

    private static buildOrderFrom(order: Order | undefined) {
        return order ?
            {
                field: order.getOrderBy().getValue(),
                direction: order.getOrderType().getValue()
            } : undefined
    }
}