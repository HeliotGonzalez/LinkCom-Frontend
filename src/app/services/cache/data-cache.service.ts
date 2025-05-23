import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataCacheService {
    private data: {[key: string]: any} = {};

    constructor() {
    }

    public get(key: string) {
        return this.data[key];
    }

    public getCacheFor(key: string): DataCacheService {
        return this.data[key] as DataCacheService;
    }

    public createCacheFor(key: string) {
        this.data[key] = new DataCacheService();
    }

    public getOrDefault(key: string, defaultValue: any) {
        let value = this.get(key);
        return value ? value : defaultValue;
    }

    public containsKey(key: string) {
        return key in this.data;
    }

    public put(key: string, value: any) {
        this.data[key] = value;
    }
}
