export interface UserChat {
    id?: string;
    from: string;
    to: string;
    fromUsername: string;
    toUsername: string;
    last_used_at: string;
    hidden: boolean;
}