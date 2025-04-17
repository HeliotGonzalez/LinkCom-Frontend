import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {Community} from "../../interfaces/community";
import {User} from "../../model/User";
import {Announce} from "../../interfaces/announce";
import {CommunityInterest} from "../../interfaces/community-interest";
import {CommunityRole} from "../../model/CommunityRole";
import {CommunityUser} from "../../model/CommunityUser";
import {CommunityService} from "./CommunityService";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HTTPCommunityService implements CommunityService {
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) {
    }

    getCommunity(communityID: string): Observable<ApiResponse<Community>> {
        return this.http.get<ApiResponse<Community>>(`${this.baseUrl}/communities/${communityID}`);
    }

    getCommunities() {
        return this.http.get<ApiResponse<Community>>(`${this.baseUrl}/communities`);
    }

    getUserCommunities(userID: string) {
        return this.http.get<ApiResponse<Community>>(`${this.baseUrl}/users/${userID}/communities`)
    }

    getCommunitiesExcludingUser(userID: string) {
        return this.http.get<ApiResponse<Community>>(`${this.baseUrl}/communities/excluding/${userID}`)
    }

    getCommunityMembers(communityID: string) {
        return this.http.get<ApiResponse<User>>(`${this.baseUrl}/communityMembers?communityID=${communityID}`);
    }

    getCommunityInterests(communityID: string) {
        return this.http.get<ApiResponse<CommunityInterest>>(`${this.baseUrl}/communityInterests?communityID=${communityID}`);
    }

    getCommunityAnnouncements(communityID: string) {
        return this.http.get<ApiResponse<Announce>>(`${this.baseUrl}/communityInterests?communityID=${communityID}`);
    }

    changeUserCommunityRole(communityID: string, userID: string, role: CommunityRole) {
        return this.http.put<ApiResponse<CommunityUser>>(`${this.baseUrl}/changeUserCommunityRole`, { communityID, userID, role });
    }

    joinCommunity(communityID: string) {
        return this.http.post<ApiResponse<Community>>(`${this.baseUrl}/joinCommunity`, { communityID });
    }

    leaveCommunity(communityID: string, userID: string) {
        return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/leaveCommunity?communityID=${communityID}&userID=${userID}`);
    }

    removeCommunity(communityID: string) {
        return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/removeCommunity?communityID=${communityID}`);
    }
}
