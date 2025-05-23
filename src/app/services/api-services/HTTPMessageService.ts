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
import { UserChat } from "../../../architecture/model/UserChat";

export class HTTPMessageService implements MessageService {

    constructor(private http: HttpClient, private url: string) {
    }

    getBetweenAndFrom(from: string, to: string): Observable<ApiResponse<Message>> {
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
                },
                {field: 'from', operator: 'neq', value: to}
            ]),
            Order.asc('created_at')
        ));
        return this.http.get<ApiResponse<Message>>(`${this.url}/messages/${serial}`);
    }

    deleteFrom(ids: string[]): Observable<void> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([{
                field: 'id',
                operator: 'in',
                value: ids
            }])
        ));
        return this.http.delete<void>(`${this.url}/messages/${serial}`);
    }

    getChatBetween(from: string, to: string): Observable<ApiResponse<UserChat>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'from', operator: 'eq', value: from},
                {field: 'to', operator: 'eq', value: to}
            ]),
            Order.asc('last_used_at')
        ));
        return this.http.get<ApiResponse<UserChat>>(`${this.url}/messages/chats/${serial}`);
    }

    hideChatBetween(from: string, to: string): Observable<ApiResponse<UserChat>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'from', operator: 'eq', value: from},
                {field: 'to', operator: 'eq', value: to}
            ])
        ));
        return this.http.patch<ApiResponse<UserChat>>(`${this.url}/messages/chats/${serial}`, {hidden: true});
    }

    unhideChatBetween(from: string, to: string): Observable<ApiResponse<UserChat>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'from', operator: 'eq', value: from},
                {field: 'to', operator: 'eq', value: to}
            ])
        ));
        return this.http.patch<ApiResponse<UserChat>>(`${this.url}/messages/chats/${serial}`, {last_used_at: new Date().toISOString(), hidden: false});
    }

    createChat(chat: UserChat): Observable<ApiResponse<UserChat>> {
        console.log(chat)
        return this.http.put<ApiResponse<UserChat>>(`${this.url}/messages/chats`, chat);
    }

    getChats(id: string): Observable<ApiResponse<UserChat>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'from', operator: 'eq', value: id},
                {field: 'hidden', operator: 'neq', value: true}
            ]),
            Order.desc('last_used_at')
        ));
        return this.http.get<ApiResponse<UserChat>>(`${this.url}/messages/chats/${serial}`);
    }

    getUsersWithChat(id: string): Observable<ApiResponse<Message>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {
                    logic: FilterGroupLogic.OR, filters: [
                        {field: 'from', operator: 'eq', value: id},
                        {field: 'to', operator: 'eq', value: id}
                    ]
                }
            ]),
        ));
        return this.http.get<ApiResponse<Message>>(`${this.url}/${serial}`);
    }

    markAsRead(ids: string[]): Observable<void> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'id', operator: 'in', value: ids}
            ])
        ))
        return this.http.patch<void>(`${this.url}/messages/${serial}`, {read_at: new Date()});
    }

    send(message: Message): Observable<ApiResponse<Message>> {
        return this.http.put<ApiResponse<Message>>(`${this.url}/messages`, message);
    }

    get(id: string): Observable<ApiResponse<Message>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'id', operator: 'eq', value: id}
            ])
        ));
        return this.http.get<ApiResponse<Message>>(`${this.url}/messages/${serial}`);
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