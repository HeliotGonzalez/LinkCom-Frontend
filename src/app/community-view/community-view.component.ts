import {Component} from '@angular/core';
import {EventViewComponent} from "../event-view/event-view.component";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../services/api-service.service";
import {AuthService} from "../services/auth.service";
import {ApiResponse} from "../interfaces/ApiResponse";
import {Announce} from "../interfaces/announce";
import {AnnouncementCardComponent} from "../announcements-list/announcement-card/announcement-card.component";
import {Notify} from "../services/notify";
import {CommunityService} from "../../architecture/services/CommunityService";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {Community} from "../../architecture/model/Community";

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
    protected isUserModerator: boolean = false;
    protected announcements: Announce[] = [];

    constructor(
        private router: Router,
        private serviceFactory: ServiceFactory,
        private route: ActivatedRoute,
        private notify: Notify,
        private apiService: ApiService,
        private authService: AuthService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            (this.serviceFactory.get('communities') as CommunityService).isUserJoined(params['communityID'], this.authService.getUserUUID()).subscribe(res => {
                this.isUserJoined = res.data.length > 0;
            });
            (this.serviceFactory.get('communities') as CommunityService).isUserModerator(params['communityID'], this.authService.getUserUUID()).subscribe(res => {
                this.isUserModerator = res.data.length > 0;
            });
            (this.serviceFactory.get('communities') as CommunityService).getCommunity(params['communityID']).subscribe(res => {
                this.community = (res as ApiResponse<Community>).data[0];
            });
            (this.serviceFactory.get('communities') as CommunityService).getCommunityEvents(params['communityID']).subscribe(res => {
                this.events = (res as ApiResponse<CommunityEvent>).data;
            });
            this.apiService.getUserEvents(this.authService.getUserUUID()).subscribe(res => {
                this.userEvents = (res as ApiResponse<CommunityEvent>).data;
            });
            (this.serviceFactory.get('communities') as CommunityService).getCommunityAnnouncements(params['communityID']).subscribe(res => {
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
        return this.authService.getUserUUID() === this.community?.creatorID;
    }

    protected async leaveCommunity() {
        this.notify.confirm(`You will be leaving ${this.community?.name}'s community`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).leaveCommunity(this.community!.id!, this.authService.getUserUUID()).subscribe({
                next: () => {
                    this.notify.success('You have left this community!');
                    this.showCommunitiesPage();
                },
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
        });
    }

    protected joinCommunity() {
        if (this.community?.isPrivate) {
            (this.serviceFactory.get('communities') as CommunityService).requestJoinToCommunity(this.community!.id!, this.authService.getUserUUID()).subscribe({
                next: () => this.notify.success('The request has been sent! Now you have to wait for a response'),
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
        } else {
            (this.serviceFactory.get('communities') as CommunityService).joinCommunity(this.community!.id!, this.authService.getUserUUID()).subscribe({
                next: () => this.notify.success('You have join this community!'),
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
        }
    }

    protected async removeCommunity() {
        this.notify.confirm(`You will not be able to revert this: REMOVE ${this.community?.name}'s community`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).removeCommunity(this.community!.id!).subscribe({
                next: () => {
                    this.notify.success('You have removed this community!');
                    this.showCommunitiesPage();
                },
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
            else this.notify.success('Your community is still safe!');
        });
    }

    private showCommunitiesPage() {
        this.router.navigate(['/communities']).then();
    }

    protected showAnnouncements() {
        this.router.navigate(["/announcementsList"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }

    protected showAnnouncementForm() {
        this.router.navigate(["/announcementCreation"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }

    showRequestsPanel() {
        this.router.navigate(["/communityRequestsPanel"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }
}
