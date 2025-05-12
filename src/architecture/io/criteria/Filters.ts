import {Filter} from "./Filter";
import {FilterGroup, FilterGroupLogic} from "./FilterGroup";

export interface FilterInterface {
    field: string;
    operator: string;
    value: string;
}

export interface FilterGroupInterface {
    logic: FilterGroupLogic;
    filters: (FilterInterface | FilterGroupInterface)[];
}

export class Filters {
    private readonly filters: (Filter | FilterGroup)[];

    constructor(filters: (Filter | FilterGroup)[]) {
        this.filters = filters;
    }

    static fromValues(filters: (FilterInterface | FilterGroupInterface)[]): Filters {
        console.log(filters)
       const filtersArray: (Filter | FilterGroup)[] = [];
       filters.forEach(f => filtersArray.push(this.buildFilterFrom(f)));
        return new Filters(filtersArray)
    }

    public getFilters() {
        return [...this.filters];
    }

    private static isFilterGroup(f: FilterInterface | FilterGroupInterface) {
        return 'logic' in f;
    }

    private static buildFilterFrom(f: FilterInterface | FilterGroupInterface) {
        if (this.isFilterGroup(f)) {
            return FilterGroup.fromValues(f)
        } else {
            return Filter.fromValues(f);
        }
    }
}

