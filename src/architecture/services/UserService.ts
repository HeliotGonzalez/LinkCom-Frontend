import {Service} from "./Service";
import {Observable} from "rxjs";
import {ApiResponse} from "../../app/interfaces/ApiResponse";
import {Community} from "../../app/interfaces/community";
import {User} from "../model/User";
import { FriendRequest } from "../model/FriendRequest";
import { RequestStatus } from "../model/RequestStatus";

export interface UserService extends Service {
    getUsers(userID: string[]): Observable<ApiResponse<User>>;
    getUser(userID: string): Observable<ApiResponse<User>>;
    getCommunities(userID: string): Observable<ApiResponse<Community>>;
    getFriends(userID: string): Observable<ApiResponse<User>>;
    makeFriendRequest(from: string, to: string): Observable<ApiResponse<FriendRequest>>;
    getFriendRequests(userID: string): Observable<ApiResponse<FriendRequest>>;
    updateFriendRequest(from: string, to: string, status: RequestStatus): Observable<ApiResponse<FriendRequest>>;
    cancelFriendRequest(from: string, to: string): Observable<ApiResponse<FriendRequest>>;
    getAllUsers(): Observable<ApiResponse<User>>;
}