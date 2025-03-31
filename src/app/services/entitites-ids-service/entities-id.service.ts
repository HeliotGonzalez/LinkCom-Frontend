import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EntitiesIdService {
    private communityKey = "community_id";
    private eventKey = "event_id";

    constructor() {
    }

    getCommunityID() {
        let value = localStorage.getItem(this.communityKey);
        return value ? value : "a0c0e447-e231-4b2e-9b12-52b6f556c598";
    }

    getEventID() {
        let value = localStorage.getItem(this.eventKey);
        return value ? value : 7;
    }
}
