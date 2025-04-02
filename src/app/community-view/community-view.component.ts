import { Component } from '@angular/core';
import {Community} from "../interfaces/community";
import {EventViewComponent} from "../event-view/event-view.component";
import {CommunityEvent} from "../interfaces/CommunityEvent";
import {Router} from "@angular/router";
import {ApiService} from "../services/api-service.service";

@Component({
  selector: 'app-community-view',
    imports: [
        EventViewComponent
    ],
  templateUrl: './community-view.component.html',
  styleUrl: './community-view.component.css'
})
export class CommunityViewComponent {
    protected events: CommunityEvent[] | null[] = [];
    protected community: Community | null = null;

    constructor(private router: Router, private apiService: ApiService) {
    }

    ngOnInit() {
        const event: CommunityEvent = {title: "Titulo", description: "Pequeña descripción", id: 1, communityID: "", userID: "", imagePath: "", dateOfTheEvent: new Date(1)};
        // @ts-ignore
        this.community = {name: "Ducks", description: "", id: "bc98f5cd-2eb2-497a-8978-1f7179a46df9", userID: "", isPrivate: true, imagePath: ""};
        // @ts-ignore
        this.apiService.getCommunityEvents(this.community?.id).subscribe(res => {
            // @ts-ignore
            console.log(res)
            // @ts-ignore
            for (const evt: CommunityEvent of Object.values(res['data'])) {
                // @ts-ignore
                this.events.push(evt);
            }
        });
    }

    protected showEventForm() {
        this.router.navigate(["/firstStepEventCreation"], {queryParams: {communityID:  this.community?.id}}).then(r => {
        });
    }

    showModeratorsManagement() {
        this.router.navigate(["/moderatorsManagement"], {queryParams: {communityID:  this.community?.id}}).then(r => {
        });
    }
}
