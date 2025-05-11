import {Criteria} from "./Criteria";

export class CriteriaSerializer {
    static serialize(criteria: Criteria) {
        const raw = {
            filters: criteria.getFilters().getFilters().map(f => ({
                field: f.getField(),
                operator: f.getOperator(),
                value: f.getValue()
            })),
            order: criteria.getOrder() ? {
                field: criteria.getOrder()!.getOrderBy().getValue(),
                direction: criteria.getOrder()!.getOrderType().getValue()
            } : undefined,
            limit: criteria.getLimit(),
            offset: criteria.getOffset()
        };

        const json = JSON.stringify(raw);
        return btoa(json);
    }
}