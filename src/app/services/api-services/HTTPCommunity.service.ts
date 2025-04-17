import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../interfaces/ApiResponse";
import {User} from "../../../architecture/model/User";
import {Announce} from "../../interfaces/announce";
import {CommunityInterest} from "../../interfaces/community-interest";
import {CommunityRole} from "../../../architecture/model/CommunityRole";
import {CommunityUser} from "../../../architecture/model/CommunityUser";
import {CommunityService} from "../../../architecture/services/CommunityService";
import {Observable} from "rxjs";
import {Community} from "../../../architecture/model/Community";

export class HTTPCommunityService implements CommunityService {
    constructor(private http: HttpClient, private url: string) {
    }

    getCommunity(communityID: string): Observable<ApiResponse<Community>> {
        return this.http.get<ApiResponse<Community>>(`${this.url}/communities/${communityID}`);
    }

    getCommunities() {
        return this.http.get<ApiResponse<Community>>(`${this.url}/communities`);
    }

    getUserCommunities(userID: string) {
        return this.http.get<ApiResponse<Community>>(`${this.url}/users/${userID}/communities`)
    }

    getCommunitiesExcludingUser(userID: string) {
        return this.http.get<ApiResponse<Community>>(`${this.url}/communities/excluding/${userID}`)
    }

    getCommunityMembers(communityID: string) {
        return this.http.get<ApiResponse<User>>(`${this.url}/communities/${communityID}/members`);
    }

    getCommunityInterests(communityID: string) {
        return this.http.get<ApiResponse<CommunityInterest>>(`${this.url}/communities/${communityID}/interests`);
    }

    getCommunityAnnouncements(communityID: string) {
        return this.http.get<ApiResponse<Announce>>(`${this.url}/communities/${communityID}/announcements`);
    }

    joinCommunity(communityID: string, userID: string) {
        return this.http.put<ApiResponse<Community>>(`${this.url}/communities/${communityID}/join`, { userID });
    }

    leaveCommunity(communityID: string, userID: string) {
        return this.http.delete<ApiResponse<Community>>(`${this.url}/communities/${communityID}/${userID}/leave`);
    }

    changeUserCommunityRole(communityID: string, userID: string, communityRole: CommunityRole) {
        return this.http.patch<ApiResponse<CommunityUser>>(`${this.url}/communities/${communityID}/${userID}/changeRole`, {communityRole});
    }

    createCommunity(community: Community): Observable<ApiResponse<Community>> {
        return this.http.put<ApiResponse<Community>>(`${this.url}/communities/create`, community);
    }

    removeCommunity(communityID: string) {
        return this.http.delete<ApiResponse<Community>>(`${this.url}/communities/${communityID}`);
    }
}
