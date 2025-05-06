export interface Comment {
    id?: string,
    body: string,
    eventID: string,
    userID: string,
    username?: string, // Optional property to hold the username
}