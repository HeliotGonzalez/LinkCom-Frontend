export interface CommunityEvent {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    created_at: Date;
    creatorID: string;
    communityID: string;
    imagePath: string;
}