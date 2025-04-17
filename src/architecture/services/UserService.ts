import {Service} from "./Service";
import {Observable} from "rxjs";
import {ApiResponse} from "../../app/interfaces/ApiResponse";
import {Community} from "../../app/interfaces/community";
import {User} from "../model/User";

export interface UserService extends Service {
    getCommunities(userID: string): Observable<ApiResponse<Community>>;
    getFriends(userID: string): Observable<ApiResponse<User>>;
}