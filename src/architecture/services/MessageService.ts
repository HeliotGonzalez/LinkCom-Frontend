import {Service} from "./Service";
import {Message} from "../model/Message";
import {Observable} from "rxjs";
import {ApiResponse} from "../../app/interfaces/ApiResponse";
import {User} from "../model/User";

export interface MessageService extends Service {
    send(message: Message): Observable<ApiResponse<Message>>;
    get(id: string): Observable<ApiResponse<Message>>;
    getBetween(from: string, to: string): Observable<ApiResponse<Message>>;
    edit(message: Message): Observable<void>;
    delete(id: string): Observable<void>;
    markAsRead(ids: string[]): Observable<void>;
    getUsersWithChat(id: string): Observable<ApiResponse<Message>>;
}