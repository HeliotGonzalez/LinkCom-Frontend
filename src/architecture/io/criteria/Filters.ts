import {Filter} from "./Filter";

export interface FilterInterface {
    field: string;
    operator: string;
    value: string;
}

export class Filters {
    private readonly filters: Filter[];

    constructor(filters: Filter []) {
        this.filters = filters;
    }

    static fromValues(filters: FilterInterface[]): Filters {
        return new Filters(filters.map(Filter.fromValues));
    }

    public getFilters() {
        return [...this.filters];
    }

    static orFromValues(filters: FilterInterface[])  {
        return new Filters([Filter.buildOrFrom(Filters.fromValues(filters))]);
    }
}

