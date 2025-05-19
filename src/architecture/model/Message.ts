export interface Message {
    id?: string;
    from: string;
    to: string;
    body: string;
    read_at?: string;
    edited_at?: string;
    deleted_at?: string;
    created_at: string;
}