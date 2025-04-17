import {Observable} from "rxjs";
import {CommunityEvent} from "../../../architecture/model/CommunityEvent";
import {EventService} from "../../../architecture/services/EventService";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../architecture/model/User";

export class HTTPEventService implements EventService {
    constructor(private http: HttpClient, private url: string) {
    }

    getEvents(): Observable<ApiResponse<CommunityEvent>> {
        return this.http.get<ApiResponse<CommunityEvent>>(`${this.url}/events`);
    }

    getEvent(eventID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.get<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}`);
    }

    getEventsExcludingUser(userID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.get<ApiResponse<CommunityEvent>>(`${this.url}/events/excluding/${userID}`);
    }

    createEvent(event: CommunityEvent): Observable<ApiResponse<CommunityEvent>> {
        return this.http.put<ApiResponse<CommunityEvent>>(`${this.url}/events/create`, event);
    }

    removeEvent(eventID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.delete<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}/delete`);
    }

    joinEvent(eventID: string, userID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.put<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}/join`, {userID});
    }

    leaveEvent(eventID: string, userID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.delete<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}/${userID}/leave`);
    }

    getMembers(eventID: string): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.url}/events/${eventID}/members`);
    }
}