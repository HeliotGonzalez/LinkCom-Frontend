export interface Message {
    id?: string;
    from: string;
    to: string;
    body: string;
    isRead: boolean;
    edited_at?: string;
    deleted_at?: string;
    created_at: string;
}