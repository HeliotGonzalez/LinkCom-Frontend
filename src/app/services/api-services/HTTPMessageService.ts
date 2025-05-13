import {Observable} from "rxjs";
import {Message} from "../../../architecture/model/Message";
import {MessageService} from "../../../architecture/services/MessageService";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {HttpClient} from "@angular/common/http";
import {CriteriaSerializer} from "../../../architecture/io/criteria/CriteriaSerializer";
import {Criteria} from "../../../architecture/io/criteria/Criteria";
import {Filters} from "../../../architecture/io/criteria/Filters";
import {Order} from "../../../architecture/io/criteria/Order";
import {FilterGroupLogic} from "../../../architecture/io/criteria/FilterGroup";

export class HTTPMessageService implements MessageService {

    constructor(private http: HttpClient, private url: string) {
    }

    send(message: Message): Observable<void> {
        return this.http.put<void>(`${this.url}/messages`, message);
    }

    get(id: string): Observable<ApiResponse<Message>> {
        return this.http.get<ApiResponse<Message>>(`${this.url}/messages/${id}`);
    }

    getBetween(from: string, to: string): Observable<ApiResponse<Message>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {
                    logic: FilterGroupLogic.OR, filters: [
                        {
                            logic: FilterGroupLogic.AND, filters: [
                                {field: 'from', operator: 'eq', value: from},
                                {field: 'to', operator: 'eq', value: to}
                            ]
                        },
                        {
                            logic: FilterGroupLogic.AND, filters: [
                                {field: 'to', operator: 'eq', value: from},
                                {field: 'from', operator: 'eq', value: to}
                            ]
                        },
                    ]
                }
            ]),
            Order.asc('created_at')
        ));
        return this.http.get<ApiResponse<Message>>(`${this.url}/messages/${serial}`);
    }

    edit(message: Message): Observable<void> {
        return this.http.patch<void>(`${this.url}/messages/${message.id}}`, message);
    }

    delete(id: string): Observable<void> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([{
                field: 'id',
                operator: 'eq',
                value: id
            }])
        ));
        return this.http.delete<void>(`${this.url}/messages/${serial}`);
    }
}