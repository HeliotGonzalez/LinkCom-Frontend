import {Service} from "./Service";
import {Message} from "../model/Message";
import {Observable} from "rxjs";
import {ApiResponse} from "../../app/interfaces/ApiResponse";

export interface MessageService extends Service {
    send(message: Message): void;
    get(id: string): Observable<ApiResponse<Message>>;
    getBetween(from: string, to: string): Observable<ApiResponse<Message>>;
    edit(message: Message): void;
    delete(id: string): void;
}