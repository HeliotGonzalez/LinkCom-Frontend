import {Injectable} from '@angular/core';
import {Service} from "../../../architecture/services/Service";

@Injectable({
    providedIn: 'root'
})
export class ServiceFactory {
    private services: { [name: string]: Service } = {};

    put(name: string, service: Service) {
        this.services[name] = service;
        return this;
    }

    get(name: string) {
        return this.services[name];
    }
}
