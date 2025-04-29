import {RequestStatus} from "./RequestStatus";

export interface JoinRequest {
    id: string;
    communityID: string;
    userID: string;
    status: RequestStatus;
    decidedAt: Date;
    decidedBy: string;
}