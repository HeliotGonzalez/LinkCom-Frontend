import {Injectable} from '@angular/core';
import {Command} from "../architecture/Commands/Command";

@Injectable({
    providedIn: 'root'
})
export class CommandBuilderFactory {
    private builderMap: {[key: string]: Builder} = {};

    constructor() {
    }

    register(name: string, builder: Builder) {
        this.builderMap[name] = builder;
        return this;
    }

    named(name: string): Builder {
        return this.builderMap[name];
    }
}

interface Builder {
    build(): Command;
}
