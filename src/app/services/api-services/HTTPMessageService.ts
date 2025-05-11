import { Observable } from "rxjs";
import { Message } from "../../../architecture/model/Message";
import {MessageService} from "../../../architecture/services/MessageService";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {HttpClient} from "@angular/common/http";

export class HTTPMessageService implements MessageService {

    constructor(private http: HttpClient, private url: string) {
    }

    send(message: Message): void {
        this.http.put(`${this.url}/messages`, message);
    }

    get(id: string): Observable<ApiResponse<Message>> {
        return this.http.get<ApiResponse<Message>>(`${this.url}/messages/${id}`);
    }

    getBetween(from: string, to: string): Observable<ApiResponse<Message>> {
        return this.http.get<ApiResponse<Message>>(`${this.url}/messages?sender=or;${from}.${to}`);
    }

    edit(message: Message): void {
        this.http.patch(`${this.url}/messages/${message.id}}`, message);
    }

    delete(id: string): void {
        this.http.delete(`${this.url}/messages/${id}}`);
    }
}