import { RequestStatus } from "./RequestStatus";

export interface EventUser {
    eventID: string;
    communityID: string;
    userID: string;
    joinStatus: RequestStatus;
}