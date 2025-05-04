import {ApiResponse} from "../../app/interfaces/ApiResponse";
import {User} from "../model/User";
import {CommunityInterest} from "../../app/interfaces/community-interest";
import {Announce} from "../../app/interfaces/announce";
import {CommunityUser} from "../model/CommunityUser";
import {Observable} from "rxjs";
import {CommunityRole} from "../model/CommunityRole";
import {Service} from "./Service";
import {Community} from "../model/Community";
import {CommunityEvent} from "../model/CommunityEvent";
import {JoinRequest} from "../model/JoinRequest";
import {RequestStatus} from "../model/RequestStatus";
import { CommunityAnnouncement } from "../model/CommunityAnnouncement";

export interface CommunityService extends Service {
    cancelRequest(communityID: string, userID: string): Observable<ApiResponse<JoinRequest>>;
    getUserJoinRequestOf(userID: string, communitiesIDs: string[]): Observable<ApiResponse<JoinRequest>>;
    updateJoinRequest(joinRequestID: string, decidedBy: string, decidedAt: Date, status: RequestStatus): Observable<ApiResponse<JoinRequest>>;
    requestJoinToCommunity(communityID: string, userID: string): Observable<ApiResponse<any>>;
    getCommunityJoinRequests(communityID: string): Observable<ApiResponse<JoinRequest>>;
    getCommunitiesExcludingUserFrom(userID: string, communityIDs: string[]): Observable<ApiResponse<Community>>;
    getUserCommunitiesFrom(userID: string, communityIDs: string[]): Observable<ApiResponse<Community>>;
    getCommunity(communityID: string): Observable<ApiResponse<Community>>;
    getCommunities(): Observable<ApiResponse<Community>>;
    getCommunitiesPaginated(limit: number, offset: number): Observable<ApiResponse<Community>>;
    getCommunityEvents(communityID: string): Observable<ApiResponse<CommunityEvent>>;
    getPendingCommunityEventsRequests(communityID: string): Observable<ApiResponse<CommunityEvent>>;
    isUserJoined(communityID: string, userID: string): Observable<ApiResponse<boolean>>
    getUserCommunities(userID: string): Observable<ApiResponse<Community>>;
    getCommunitiesExcludingUser(userID: string): Observable<ApiResponse<Community>>;
    getCommunityMembers(communityID: string): Observable<ApiResponse<User>>;
    getCommunityInterests(communityID: string): Observable<ApiResponse<CommunityInterest>>;
    getCommunityAnnouncements(communityID: string): Observable<ApiResponse<Announce>>;
    getCommunityModerators(communityID: string): Observable<ApiResponse<User>>;
    isUserModerator(communityID: string, userID: string): Observable<ApiResponse<User>>;
    changeUserCommunityRole(communityID: string, userID: string, role: CommunityRole): Observable<ApiResponse<CommunityUser>>;
    joinCommunity(communityID: string, userID: string): Observable<ApiResponse<Community>>;
    leaveCommunity(communityID: string, userID: string): Observable<ApiResponse<Community>>;
    createCommunity(community: Community): Observable<ApiResponse<Community>>;
    removeCommunity(communityID: string): Observable<ApiResponse<Community>>;
    removeAnnouncement(announcementID: string): Observable<ApiResponse<Announce>>;
    createAnnouncement(announcement: CommunityAnnouncement): Observable<ApiResponse<CommunityAnnouncement>>;
    removeAnnouncement(announcementID: string): Observable<ApiResponse<Announce>>;
}