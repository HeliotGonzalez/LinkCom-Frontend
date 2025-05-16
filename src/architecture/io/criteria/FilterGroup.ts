import {Filter} from "./Filter";
import {FilterGroupInterface, FilterInterface, Filters} from "./Filters";

export enum FilterGroupLogic {
    AND = '&&',
    OR = '||'
}

export class FilterGroup {
    private readonly logic: FilterGroupLogic;
    private readonly filters: (Filter | FilterGroup)[];

    constructor(
        logic: FilterGroupLogic,
        filters?: (Filter | FilterGroup)[]
    ) {
        this.logic = logic;
        this.filters = filters || [];
    }

    static fromValues(values: FilterGroupInterface) {
        const logic = values.logic;
        const filters = values.filters;
        const filterGroup = new FilterGroup(logic);
        filters.forEach(f => filterGroup.add(this.buildFrom(f)));
        return filterGroup;
    }

    public add(filter: Filter | FilterGroup): this {
        this.filters.push(filter);
        return this;
    }

    public getLogic() {
        return this.logic;
    }

    public getFilters() {
        return this.filters;
    }

    private static buildFrom(f: FilterInterface | FilterGroupInterface) {
        if (this.isFilterGroup(f)) return this.fromValues(f);
        else return Filter.fromValues(f);
    }

    private static isFilterGroup(f: FilterInterface | FilterGroupInterface) {
        return 'logic' in f;
    }
}
