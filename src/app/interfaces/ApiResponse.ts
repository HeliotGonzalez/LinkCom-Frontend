export interface ApiResponse<T> {
    error?: string;
    message: string;
    data: T[];
}