import {Service} from "./Service";
import {Observable} from "rxjs";
import {ApiResponse} from "../../app/interfaces/ApiResponse";
import {Notification} from "../model/Notification";

export interface NotificationService extends Service {
    get(id: string): Observable<ApiResponse<Notification>>;
    userNotifications(id: string): Observable<ApiResponse<Notification>>;
    send(notification: Notification): Observable<ApiResponse<Notification>>;
    removeFromRelated(ids: string[]): Observable<ApiResponse<Notification>>;
    remove(id: string): Observable<ApiResponse<Notification>>;
}