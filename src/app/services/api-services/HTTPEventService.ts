import {Observable} from "rxjs";
import {CommunityEvent} from "../../../architecture/model/CommunityEvent";
import {EventService} from "../../../architecture/services/EventService";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../architecture/model/User";
import { Comment } from "../../../architecture/model/Comment";
import {EventState} from "../../../architecture/model/EventState";
import { ApiService } from "../api-service.service";
import { CriteriaSerializer } from "../../../architecture/io/criteria/CriteriaSerializer";
import { Criteria } from "../../../architecture/io/criteria/Criteria";
import { Filters } from "../../../architecture/io/criteria/Filters";
import { RequestStatus } from "../../../architecture/model/RequestStatus";

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
        const interests = event.interests;
        delete event.interests;
        const parameters = event;
        return this.http.put<ApiResponse<CommunityEvent>>(`${this.url}/events`, {parameters, interests});
    }

    removeEvent(eventID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.delete<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}`);
    }

    joinEvent(communityID: string, eventID: string, userID: string, joinStatus: RequestStatus): Observable<ApiResponse<CommunityEvent>> {
        return this.http.put<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}/join`, {communityID, userID, joinStatus});
    }

    leaveEvent(eventID: string, userID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.delete<ApiResponse<CommunityEvent>>(`${this.url}/events/${eventID}/${userID}/leave`);
    }

    /*
    getMembers(eventID: string): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.url}/events/${eventID}/members`);
    }
    */
    
    getMembers(eventID: string): Observable<ApiResponse<User>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'eventID', operator: 'eq', value: eventID},
                {field: 'joinStatus', operator: 'eq', value: RequestStatus.ACCEPTED}
            ])
        ));
        return this.http.get<ApiResponse<User>>(`${this.url}/events/${eventID}/members/${serial}`);
    }

    createComment(comment: Comment): Observable<ApiResponse<Comment>> {
        return this.http.post<ApiResponse<Comment>>(`${this.url}/events/${comment.eventID}/createComment`, comment);
    }

    getComments(eventID: string): Observable<ApiResponse<Comment>> {
        return this.http.get<ApiResponse<Comment>>(`${this.url}/events/${eventID}/getComments`);
    }

    getEventQueue(eventID: string): Observable<ApiResponse<User>> {
        const serial = CriteriaSerializer.serialize(new Criteria(
            Filters.fromValues([
                {field: 'eventID', operator: 'eq', value: eventID},
                {field: 'joinStatus', operator: 'eq', value: RequestStatus.PENDING}
            ])
        ));
        return this.http.get<ApiResponse<User>>(`${this.url}/events/${eventID}/members/${serial}`);
    }

}