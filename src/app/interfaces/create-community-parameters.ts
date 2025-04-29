export interface CreateCommunityParameters {
    userID: string;
    description: string | null;
    name: string;
    isPrivate: boolean;
    img: string | null;
    communityInterests: string[];
}