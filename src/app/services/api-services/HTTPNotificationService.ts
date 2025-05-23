import { Observable } from "rxjs";
import { Notification } from "../../../architecture/model/Notification";
import {NotificationService} from "../../../architecture/services/NotificationService";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {HttpClient} from "@angular/common/http";
import {CriteriaSerializer} from "../../../architecture/io/criteria/CriteriaSerializer";
import {Criteria} from "../../../architecture/io/criteria/Criteria";
import {Filters} from "../../../architecture/io/criteria/Filters";

export class HTTPNotificationService implements NotificationService {

    constructor(private http: HttpClient, private url: string) {
    }

    remove(id: string): Observable<ApiResponse<Notification>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'id', operator: 'eq', value: id}
            ])
        ));
        return this.http.delete<ApiResponse<Notification>>(`${this.url}/notifications/${serial}`)
    }

    removeFromRelated(ids: string[]): Observable<ApiResponse<Notification>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'relatedID', operator: 'in', value: ids}
            ])
        ));
        return this.http.delete<ApiResponse<Notification>>(`${this.url}/notifications/${serial}`)
    }

    send(notification: Notification): Observable<ApiResponse<Notification>> {
        return this.http.put<ApiResponse<Notification>>(`${this.url}/notifications`, notification);
    }

    get(id: string): Observable<ApiResponse<Notification>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'id', operator: 'eq', value: id}
            ])
        ));
        return this.http.get<ApiResponse<Notification>>(`${this.url}/notifications/${serial}`);
    }

    userNotifications(id: string): Observable<ApiResponse<Notification>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'recipientID', operator: 'eq', value: id}
            ])
        ));
        return this.http.get<ApiResponse<Notification>>(`${this.url}/notifications/${serial}`);
    }
}