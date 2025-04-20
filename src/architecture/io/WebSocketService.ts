import {Observable} from "rxjs";
import {SocketResponse} from "./SocketResponse";
import {Socket} from "socket.io-client";

export class WebSocketService<T> {
    private socket: Socket;
    private readonly table: string;

    constructor(socket: Socket, table: string) {
        this.socket = socket;
        this.table = table.toLowerCase();
    }

    onInsert(): Observable<SocketResponse<T>> {
        return new Observable<SocketResponse<T>>((observer) => {
            this.socket.on(`${this.table}:INSERT`, (data: SocketResponse<T>) => {
                observer.next(data);
            });
        });
    }

    onUpdate(): Observable<SocketResponse<T>> {
        return new Observable<SocketResponse<T>>((observer) => {
            this.socket.on(`${this.table}:UPDATE`, (data: SocketResponse<T>) => {
                observer.next(data);
            });
        });
    }

    onDelete(): Observable<SocketResponse<T>> {
        return new Observable<SocketResponse<T>>((observer) => {
            this.socket.on(`${this.table}:DELETE`, (data: SocketResponse<T>) => {
                observer.next(data);
            });
        });
    }
}