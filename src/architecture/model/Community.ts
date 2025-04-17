import {CommunityInterest} from "../../app/interfaces/community-interest";

export interface Community {
    id?: string;
    name: string;
    description: string;
    isPrivate: boolean;
    creatorID: string;
    imagePath?: string;
    interests?: CommunityInterest[];
}