import {Service} from "./Service";
import {Observable} from "rxjs";
import {ApiResponse} from "../../app/interfaces/ApiResponse";
import {CommunityEvent} from "../model/CommunityEvent";
import {User} from "../model/User";

export interface EventService extends Service {
    getEvents(): Observable<ApiResponse<CommunityEvent>>;
    getEvent(eventID: string): Observable<ApiResponse<CommunityEvent>>;
    getEventsExcludingUser(userID: string): Observable<ApiResponse<CommunityEvent>>;
    getMembers(eventID: string): Observable<ApiResponse<User>>;
    createEvent(event: CommunityEvent): Observable<ApiResponse<CommunityEvent>>;
    removeEvent(eventID: string): Observable<ApiResponse<CommunityEvent>>;
    joinEvent(communityID: string, eventID: string, userID: string): Observable<ApiResponse<CommunityEvent>>;
    leaveEvent(eventID: string, userID: string): Observable<ApiResponse<CommunityEvent>>;
    getUserCommunityEvents(communityID: string, userID: string): Observable<ApiResponse<CommunityEvent>>;
}