import {Component, Inject} from '@angular/core';
import {Community} from "../interfaces/community";
import {EventViewComponent} from "../event-view/event-view.component";
import {CommunityEvent} from "../model/CommunityEvent";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../services/api-service.service";
import {AuthService} from "../services/auth.service";
import {ApiResponse} from "../interfaces/ApiResponse";
import {Announce} from "../interfaces/announce";
import {AnnouncementCardComponent} from "../announcements-list/announcement-card/announcement-card.component";
import {Notify} from "../services/notify";
import {CommunityService} from "../services/api-services/CommunityService";

@Component({
    selector: 'app-community-view',
    imports: [
        EventViewComponent,
        AnnouncementCardComponent
    ],
    templateUrl: './community-view.component.html',
    standalone: true,
    styleUrl: './community-view.component.css'
})
export class CommunityViewComponent {
    protected events: CommunityEvent[] = [];
    protected community: Community | null = null;
    protected userEvents: CommunityEvent[] = [];
    protected isUserJoined: boolean = false;
    protected announcements: Announce[] = [];

    constructor(private router: Router, @Inject('CommunityService') private communityService: CommunityService, private route: ActivatedRoute, private notify: Notify, private apiService: ApiService, private authService: AuthService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.isUserJoined = params['isUserJoined'];

            this.communityService.getCommunity(params['communityID']).subscribe(res => {
                this.community = (res as ApiResponse<Community>).data[0];
            });

            this.apiService.getCommunityEvents(params['communityID']).subscribe(res => {
                this.events = (res as ApiResponse<CommunityEvent>).data;
            });

            this.apiService.getUserEvents(this.authService.getUserUUID()).subscribe(res => {
                this.userEvents = (res as ApiResponse<CommunityEvent>).data;
            });

            this.communityService.getCommunityAnnouncements(params['communityID']).subscribe(res => {
                this.announcements = (res as ApiResponse<Announce>).data;
            });
        });
    }

    protected showEventForm() {
        this.router.navigate(["/firstStepEventCreation"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }

    protected showModeratorsManagement() {
        this.router.navigate(["/moderatorsManagement"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }

    protected isUserInEvent(event: CommunityEvent): boolean {
        return this.userEvents?.map(e => e.id).includes(event.id)!;
    }

    protected isCreator() {
        return this.authService.getUserUUID() === this.community?.userID;
    }

    protected async leaveCommunity() {
        const confirm = await this.notify.confirm(`You will be leaving ${this.community?.name}'s community`);
        if (confirm) this.communityService.leaveCommunity(this.community!.id, this.authService.getUserUUID()).subscribe({
            next: () => this.notify.success('You have left this community!'),
            error: res => this.notify.error(`An error occurred: ${res.message}`)
        });
    }

    protected joinCommunity() {
        this.communityService.joinCommunity(this.community!.id, this.authService.getUserUUID()).subscribe({
            next: () => this.notify.success('You have join this community!'),
            error: res => this.notify.error(`An error occurred: ${res.message}`)
        });
    }

    protected async removeCommunity() {
        const confirm = await this.notify.confirm(`You will not be able to revert this: REMOVE ${this.community?.name}'s community`);
        if (confirm) this.communityService.leaveCommunity(this.community!.id, this.authService.getUserUUID()).subscribe({
            next: () => this.notify.success('You have removed this community!'),
            error: res => this.notify.error(`An error occurred: ${res.message}`)
        });
        else this.notify.success('Your community is still safe!');
    }

    protected showAnnouncements() {
        this.router.navigate(["/announcementsList"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }

    protected showAnnouncementForm() {
        this.router.navigate(["/announcementCreation"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }
}
