import { RequestStatus } from "./RequestStatus";

export interface FriendRequest {
    from: string;
    to: string;
    status: RequestStatus;
    createdAt: Date;
}
