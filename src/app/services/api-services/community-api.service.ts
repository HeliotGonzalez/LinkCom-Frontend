import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {Community} from "../../interfaces/community";
import {User} from "../../model/User";
import {Announce} from "../../interfaces/announce";
import {CommunityRole} from "../../model/CommunityRole";
import {CommunityUser} from "../../model/CommunityUser";

@Injectable({
    providedIn: 'root'
})
export class CommunityApiService {
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) {
    }

    getCommunities() {
        return this.http.get<ApiResponse<Community>>(`${this.baseUrl}/communities`);
    }

    getCommunityMembers(communityID: string) {
        return this.http.get<ApiResponse<User>>(`${this.baseUrl}/communityMembers?communityID=${communityID}`);
    }

    getCommunityInterests(communityID: string) {
        return this.http.get<ApiResponse<CommunityInterest>>(`${this.baseUrl}/communityInterests?communityID=${communityID}`);
    }

    getCommunityAnnounces(communityID: string) {
        return this.http.get<ApiResponse<Announce>>(`${this.baseUrl}/communityInterests?communityID=${communityID}`);
    }

    changeUserCommunityRole(communityID: string, userID: string, role: CommunityRole) {
        return this.http.put<ApiResponse<CommunityUser>>(`${this.baseUrl}/changeUserCommunityRole`, { communityID, userID, role });
    }

    joinCommunity(community: Community) {
        return this.http.post<ApiResponse<Community>>(`${this.baseUrl}/joinCommunity`, { community });
    }

    leaveCommunity(communityID: string, userID: string) {
        return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/leaveCommunity?communityID=${communityID}&userID=${userID}`);
    }

    removeCommunity(communityID: string) {
        return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/removeCommunity?communityID=${communityID}`);
    }
}
