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
import { CommunityEvent } from "../../../architecture/model/CommunityEvent";

export class HTTPCommunityService implements CommunityService {
    constructor(private http: HttpClient, private url: string) {
    }

    getCommunitiesExcludingUserFrom(userID: string, communityIDs: string[]) {
        return this.http.get<ApiResponse<Community>>(`${this.url}/communities/excluding/${userID}?id=in;${communityIDs}`)
    }
    getUserCommunitiesFrom(userID: string, communityIDs: string[]) {
        return this.http.get<ApiResponse<Community>>(`${this.url}/users/${userID}/communities?communityID=in;${communityIDs}`)
    }

    getCommunitiesPaginated(limit: number, offset: number): Observable<ApiResponse<Community>> {
        return this.http.get<ApiResponse<Community>>(`${this.url}/communities?${limit}=pagination;${offset}`);
    }

    getCommunityModerators(communityID: string): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.url}/communities/${communityID}/moderators?communityRole=moderator`)
    }
    isUserModerator(communityID: string, userID: string): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.url}/communities/${communityID}/members?communityRole=moderator&userID=${userID}`)
    }

    isUserJoined(communityID: string, userID: string): Observable<ApiResponse<Community>> {
        return this.http.get<ApiResponse<Community>>(`${this.url}/users/${userID}/communities?communityID=${communityID}`)
    }

    getCommunityEvents(communityID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.get<ApiResponse<CommunityEvent>>(`${this.url}/communities/${communityID}/events`);
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

    getCommunityMembers(communityID: string): Observable<ApiResponse<User>> {
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
        const interests = community.interests;
        delete community.interests;
        const parameters = community;
        return this.http.put<ApiResponse<Community>>(`${this.url}/communities`, {parameters, interests});
    }

    removeCommunity(communityID: string) {
        return this.http.delete<ApiResponse<Community>>(`${this.url}/communities/${communityID}`);
    }
}
