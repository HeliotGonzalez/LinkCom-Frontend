import { Observable } from "rxjs";
import { User } from "../../../architecture/model/User";
import {UserService} from "../../../architecture/services/UserService";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {Community} from "../../interfaces/community";
import {HttpClient} from "@angular/common/http";
import { FriendRequest } from "../../../architecture/model/FriendRequest";
import { RequestStatus } from "../../../architecture/model/RequestStatus";

export class HTTPUserService implements UserService {
    constructor(private http: HttpClient, private url: string) {
    }
    createUser(user: User): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(`${this.url}/users/register`, user);
    }

    getUsers(userID: string[]): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.url}/users?id=in;${userID}`);
    }

    getUser(userID: string): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.url}/users/${userID}`);
    }
    getCommunities(userID: string): Observable<ApiResponse<Community>> {
        throw new Error("Method not implemented.");
    }
    getFriends(userID: string): Observable<ApiResponse<User>> {
        console.log('Solicitando amigos de usuario con ID:', userID)
        return this.http.get<ApiResponse<User>>(`${this.url}/users/${userID}/getFriends`);
    }

    makeFriendRequest(from: string, to: string): Observable<ApiResponse<FriendRequest>> {
        return this.http.post<ApiResponse<FriendRequest>>(`${this.url}/users/${from}/makeFriendRequest`, {from, to});
    }    
    
    getFriendRequests(userID: string): Observable<ApiResponse<FriendRequest>> {
        return this.http.get<ApiResponse<FriendRequest>>(`${this.url}/users/${userID}/friendRequests?to=${userID}`);
    }
    
    updateFriendRequest(from: string, to: string, status: RequestStatus): Observable<ApiResponse<FriendRequest>> {
        return this.http.patch<ApiResponse<FriendRequest>>(`${this.url}/users/${from}/updateFriendRequest?to=${to}`, { status });
    }
    
    cancelFriendRequest(from: string, to: string): Observable<ApiResponse<FriendRequest>> {
        return this.http.delete<ApiResponse<FriendRequest>>(
            `${this.url}/users/${from}/cancelFriendRequest?to=${to}`
        );
    }

    getAllUsers(): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.url}/users`);
    }
    
}