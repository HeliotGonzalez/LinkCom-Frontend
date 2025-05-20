import { Community } from "./Community";

export interface User {
    name?: string;
    id?: string;
    username: string;
    description: string | null;
    email: string;
    imagePath?: string;
    communities?: Community[];
    interests: string[];
    created_at?: string;
    stats?: {
        communities: number;
        eventsJoined: number;   
    };
}