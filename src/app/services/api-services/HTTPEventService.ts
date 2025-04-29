import {Observable} from "rxjs";
import {CommunityEvent} from "../../../architecture/model/CommunityEvent";
import {EventService} from "../../../architecture/services/EventService";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../architecture/model/User";
import { Comment } from "../../../architecture/model/Comment";
import {EventState} from "../../../architecture/model/EventState";

export class HTTPEventService implements EventService {
    constructor(private http: HttpClient, private url: string) {
    }

    acceptEvent(eventID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.patch<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}/update`, {eventState: EventState.PUBLISHED});
    }

    getUserCommunityEvents(communityID: string, userID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.get<ApiResponse<CommunityEvent>>(`${this.url}/events/joined/${userID}?communityID=${communityID}`);
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
        return this.http.put<ApiResponse<CommunityEvent>>(`${this.url}/events`, event);
    }

    removeEvent(eventID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.delete<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}/delete`);
    }

    joinEvent(communityID: string, eventID: string, userID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.put<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}/join`, {communityID, userID});
    }

    leaveEvent(eventID: string, userID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.delete<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}/${userID}/leave`);
    }

    getMembers(eventID: string): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.url}/events/${eventID}/members`);
    }

    createComment(comment: Comment): Observable<ApiResponse<Comment>> {
        return this.http.post<ApiResponse<Comment>>(`${this.url}/events/${comment.eventID}/createComment`, comment);
    }

    getComments(eventID: string): Observable<ApiResponse<Comment>> {
        return this.http.get<ApiResponse<Comment>>(`${this.url}/events/${eventID}/getComments`);
    }


}