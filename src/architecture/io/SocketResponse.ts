export interface SocketResponse<T> {
    table: string;
    new: T | null;
    old: T |null;
    error: any;
}