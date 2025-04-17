export interface User {
    id: string;
    username: string;
    description: string | null;
    email: string;
    created_at: Date;
}