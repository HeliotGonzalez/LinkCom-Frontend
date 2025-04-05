export interface CommunityEvent {
    id: number;
    title: string;
    description: string;
    communityID: string;
    userID: string;
    dateOfTheEvent: Date;
    imagePath: string;
}