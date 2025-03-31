import {Injectable} from '@angular/core';
import {ApiService} from "../api-service.service";

@Injectable({
    providedIn: 'root'
})
export class ImageStoreService {

    constructor(private apiService: ApiService) {
    }

    getCommunityImage(communityID: string) {

    }

    getEventImage(communityID: string, eventID: string) {

    }
}
