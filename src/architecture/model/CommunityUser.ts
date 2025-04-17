import {CommunityRole} from "./CommunityRole";

export interface CommunityUser {
    communityID: string;
    userID: string;
    communityRole: CommunityRole;
}