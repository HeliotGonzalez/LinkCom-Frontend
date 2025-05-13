export enum EntityType {
    Event = 'event',
    News = 'news',
    Community = 'Community',
    User = 'User',
    Comment = 'Comment',
}

export enum ReportState 
{
    New = 'new',
    UnderRevision = 'Under Revision',
    Done = 'done'

}

export interface Report {
    id: string;
    reporterID: string;
    reportState: ReportState;
    entityType: EntityType;
    entityID: string;
    reasons: string[];
    date: Date;
}
