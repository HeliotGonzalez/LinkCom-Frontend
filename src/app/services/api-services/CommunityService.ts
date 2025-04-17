import {ApiResponse} from "../../interfaces/ApiResponse";
import {Community} from "../../interfaces/community";
import {User} from "../../model/User";
import {CommunityInterest} from "../../interfaces/community-interest";
import {Announce} from "../../interfaces/announce";
import {CommunityUser} from "../../model/CommunityUser";
import {Observable} from "rxjs";
import {CommunityRole} from "../../model/CommunityRole";

export interface CommunityService {
    getCommunity(communityID: string): Observable<ApiResponse<Community>>;
    getCommunities(): Observable<ApiResponse<Community>>;
    getUserCommunities(userID: string): Observable<ApiResponse<Community>>;
    getCommunitiesExcludingUser(userID: string): Observable<ApiResponse<Community>>;
    getCommunityMembers(communityID: string): Observable<ApiResponse<User>>;
    getCommunityInterests(communityID: string): Observable<ApiResponse<CommunityInterest>>;
    getCommunityAnnouncements(communityID: string): Observable<ApiResponse<Announce>>;
    changeUserCommunityRole(communityID: string, userID: string, role: CommunityRole): Observable<ApiResponse<CommunityUser>>;
    joinCommunity(communityID: string, userID: string): Observable<ApiResponse<Community>>;
    leaveCommunity(communityID: string, userID: string): Observable<ApiResponse<Community>>;
    removeCommunity(communityID: string): Observable<ApiResponse<Community>>;
}