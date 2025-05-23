import {EventState} from "./EventState";

export interface CommunityEvent {
    id?: string;
    title: string;
    description: string;
    date: string;
    location: string;
    creatorID: string;
    communityID: string;
    imagePath: string;
    eventState: EventState;
    slots: number;
}