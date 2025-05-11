export interface Message {
    id?: string;
    from: string;
    to: string;
    body: string;
    isRead: boolean;
    editedAt?: string;
    deletedAt?: string;
    created_at: string;
}