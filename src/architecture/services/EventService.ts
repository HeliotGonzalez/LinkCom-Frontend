import {Service} from "./Service";
import {Observable} from "rxjs";
import {ApiResponse} from "../../app/interfaces/ApiResponse";
import {CommunityEvent} from "../model/CommunityEvent";
import {Comment} from "../model/Comment";
import {User} from "../model/User";
import { RequestStatus } from "../model/RequestStatus";

export interface EventService extends Service {
    getEvents(): Observable<ApiResponse<CommunityEvent>>;
    getEvent(eventID: string): Observable<ApiResponse<CommunityEvent>>;
    getEventsExcludingUser(userID: string): Observable<ApiResponse<CommunityEvent>>;
    getMembers(eventID: string): Observable<ApiResponse<User>>;
    createEvent(event: CommunityEvent): Observable<ApiResponse<CommunityEvent>>;
    removeEvent(eventID: string): Observable<ApiResponse<CommunityEvent>>;
    joinEvent(communityID: string, eventID: string, userID: string, joinStatus: RequestStatus): Observable<ApiResponse<CommunityEvent>>;
    leaveEvent(eventID: string, userID: string): Observable<ApiResponse<CommunityEvent>>;
    getUserCommunityEvents(communityID: string, userID: string): Observable<ApiResponse<CommunityEvent>>;
    createComment(comment: Comment): Observable<ApiResponse<Comment>>;
    getComments(eventID: string): Observable<ApiResponse<Comment>>;
    acceptEvent(eventID: string): Observable<ApiResponse<CommunityEvent>>;
    getEventQueue(eventID: string): Observable<ApiResponse<User>>;
}