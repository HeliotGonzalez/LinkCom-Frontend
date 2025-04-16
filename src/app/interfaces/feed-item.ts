export interface FeedItem {
    id: string;
    communityID: string;
    type: 'event' | 'news';
    title: string;
    content: string;
    date: Date;
}
