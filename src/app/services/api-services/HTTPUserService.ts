import { Observable } from "rxjs";
import { User } from "../../../architecture/model/User";
import {UserService} from "../../../architecture/services/UserService";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {Community} from "../../interfaces/community";
import {HttpClient} from "@angular/common/http";

export class HTTPUserService implements UserService {
    constructor(private http: HttpClient, private url: string) {
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
        throw new Error("Method not implemented.");
    }

}