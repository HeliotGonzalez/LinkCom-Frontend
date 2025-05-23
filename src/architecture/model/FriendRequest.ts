import { RequestStatus } from "./RequestStatus";

export interface FriendRequest {
    id?: string;
    from: string;
    to: string;
    status: RequestStatus;
    createdAt: Date;
}
