import {Injectable} from '@angular/core';
import {WebSocketService} from "../../../architecture/io/WebSocketService";

@Injectable({
    providedIn: 'root'
})
export class WebSocketFactory {
    private sockets: { [name: string]: WebSocketService<any> } = {};

    put(name: string, service: WebSocketService<any>) {
        this.sockets[name] = service;
        return this;
    }

    get(name: string) {
        return this.sockets[name];
    }
}
