import {NotificationType} from "./NotificationType";

export interface Notification {
    id?: string;
    type: NotificationType;
    relatedID: string;
    recipientID: string;
    read_at?: string;
    created_at?: string;
}