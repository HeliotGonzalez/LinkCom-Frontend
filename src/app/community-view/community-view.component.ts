import {Component} from '@angular/core';
import {Community} from "../interfaces/community";
import {EventViewComponent} from "../event-view/event-view.component";
import {CommunityEvent} from "../model/CommunityEvent";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../services/api-service.service";
import {AuthService} from "../services/auth.service";
import {ApiResponse} from "../interfaces/ApiResponse";
import {Announce} from "../interfaces/announce";
import {AnnouncementCardComponent} from "../announcements-list/announcement-card/announcement-card.component";
import {ApiServiceTranslator} from "../model/ApiServiceTranslator";
import {CommunityApiService} from "../services/api-services/community-api.service";
import {AlertService} from "../services/alert.service";

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
    private apiServiceTranslator: ApiServiceTranslator | null;

    constructor(private router: Router, private route: ActivatedRoute, private alertService: AlertService, private communityApi: CommunityApiService, private apiService: ApiService, private authService: AuthService) {
     this.apiServiceTranslator = new ApiServiceTranslator(this.alertService);
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.isUserJoined = params['isUserJoined'];

            this.apiService.getCommunity(params['communityID']).subscribe(res => {
                this.community = (res as ApiResponse<Community>).data[0];
            });

            this.apiService.getCommunityEvents(params['communityID']).subscribe(res => {
                this.events = (res as ApiResponse<CommunityEvent>).data;
            });

            this.apiService.getUserEvents(this.authService.getUserUUID()).subscribe(res => {
                this.userEvents = (res as ApiResponse<CommunityEvent>).data;
            });

            this.apiService.getAnnouncements(params['communityID']).subscribe(res => {
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
        const confirm = await this.alertService.confirm(`You will be leaving ${this.community?.name}'s community`);
        if (confirm) this.apiServiceTranslator!.dualResponse(
            this.apiService.leaveCommunity(this.authService.getUserUUID(), this.community!.id),
            `You have left ${this.community?.name}'s community!`,
            'You still being in this community!'
        );
    }

    protected joinCommunity() {
        this.apiServiceTranslator!.dualResponse(
            this.apiService.joinCommunity(this.authService.getUserUUID(), this.community!.id),
            `You have joined ${this.community?.name}'s community!`,
            `We could not add you to this community`
        );
    }

    protected async removeCommunity() {
        const confirm = await this.alertService.confirm(`You will not be able to revert this: REMOVE ${this.community?.name}'s community`);
        if (confirm) this.apiServiceTranslator!.dualResponse(
            this.apiService.leaveCommunity(this.authService.getUserUUID(), this.community!.id),
            `You have removed ${this.community?.name}'s community!`,
            'Your community still safe!'
        );
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
