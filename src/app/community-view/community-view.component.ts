import {Component} from '@angular/core';
import {EventViewComponent} from "../event-view/event-view.component";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Announce} from "../interfaces/announce";
import {AnnouncementCardComponent} from "../announcements-list/announcement-card/announcement-card.component";
import {CommunityService} from "../../architecture/services/CommunityService";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {Community} from "../../architecture/model/Community";
import {CommunityRequestsPanelComponent} from "../community-requests-panel/community-requests-panel.component";
import {WebSocketFactory} from "../services/api-services/WebSocketFactory.service";
import {CommunityUser} from "../../architecture/model/CommunityUser";
import {firstValueFrom} from "rxjs";
import {CommunityRole} from "../../architecture/model/CommunityRole";
import {EventService} from "../../architecture/services/EventService";
import {RouterCommand} from "../commands/RouterCommand";
import {JoinCommunityCommand} from "../commands/JoinCommunityCommand";
import {RemoveCommunityCommand} from "../commands/RemoveCommunityCommand";
import {LeaveCommunityCommand} from "../commands/LeaveCommunityCommand";
import {JoinRequest} from "../../architecture/model/JoinRequest";
import {CancelJoinRequestCommunityCommand} from "../commands/CancelJoinRequestCommunityCommand";
import {JoinEventCommand} from "../commands/JoinEventCommand";
import {LeaveEventCommand} from "../commands/LeaveEventCommand";
import {EventUser} from "../../architecture/model/EventUser";
import {BlurPanelComponent} from "../blur-panel/blur-panel.component";
import {RequestStatus} from "../../architecture/model/RequestStatus";
import {EventsRequestPanelComponent} from "../events-request-panel/events-request-panel.component";

@Component({
    selector: 'app-community-view',
    imports: [
        EventViewComponent,
        AnnouncementCardComponent,
        CommunityRequestsPanelComponent,
        BlurPanelComponent,
        EventsRequestPanelComponent
    ],
    templateUrl: './community-view.component.html',
    standalone: true,
    styleUrl: './community-view.component.css'
})
export class CommunityViewComponent {
    protected events: {[key: string]: CommunityEvent} = {};
    protected community: Community | null = null;
    protected userEvents: {[key: string]: CommunityEvent} = {};
    protected isUserJoined: boolean = false;
    protected isRequested: boolean = false;
    protected isUserModerator: boolean = false;
    protected announcements: Announce[] = [];
    protected requestPanelVisible: boolean = false;
    protected eventsRequestPanelVisible: boolean = false;
    protected isLoaded: boolean = false;
    protected eventRequests: {[key: string]: CommunityEvent} = {};

    constructor(
        protected serviceFactory: ServiceFactory,
        private socketFactory: WebSocketFactory,
        private route: ActivatedRoute,
        protected authService: AuthService) {
    }

     ngOnInit() {
        this.route.queryParams.subscribe(async params => {
            this.isUserJoined = await this.checkIfIsUserJoined(params['communityID'], this.authService.getUserUUID());
            this.isUserModerator = await this.checkIfIsUserModerator(params['communityID'], this.authService.getUserUUID());
            this.isRequested = await this.checkIfIsRequested(params['communityID'], this.authService.getUserUUID());
            this.community = await this.getCommunity(params['communityID']);
            (await this.loadEventRequests()).forEach(e => this.eventRequests[e.id!] = e);
            (await this.getCommunityEvents(params['communityID'])).forEach(e => this.events[e.id!] = e);
            (await this.getUserCommunityEvents(params['communityID'], this.authService.getUserUUID())).forEach(e => this.userEvents[e.id!] = e);
            this.announcements = await this.getCommunityAnnouncements(params['communityID']);
            this.initializeSockets();
            this.isLoaded = true;
        });
    }

    private async loadEventRequests() {
        return (await firstValueFrom((this.serviceFactory.get('communities') as CommunityService).getPendingCommunityEventsRequests(this.community?.id!))).data;
    }

    private async checkIfIsUserJoined(communityID: string, userID: string) {
        return (await firstValueFrom((this.serviceFactory.get('communities') as CommunityService).isUserJoined(communityID, userID))).data[0];
    }

    private async getCommunity(communityID: string) {
        return (await (firstValueFrom((this.serviceFactory.get('communities') as CommunityService).getCommunity(communityID)))).data[0];
    }

    private updateUserJoined(communityUser: CommunityUser, isJoined: boolean) {
        if (communityUser.userID !== this.authService.getUserUUID() || communityUser.communityID !== this.community?.id) return;
        this.isUserJoined = isJoined;
        this.isUserModerator = communityUser.communityRole === CommunityRole.MODERATOR;
    }

    protected isUserInEvent(event: CommunityEvent): boolean {
        return this.userEvents[event.id!] !== undefined;
    }

    protected isCreator() {
        return this.authService.getUserUUID() === this.community?.creatorID;
    }

    showRequestsPanel() {
        this.requestPanelVisible = true;
    }

    closeRequestPanel() {
        this.requestPanelVisible = false;
    }

    private async getCommunityEvents(communityID: string) {
        return (await firstValueFrom((this.serviceFactory.get('communities') as CommunityService).getCommunityEvents(communityID))).data;
    }

    private async getUserCommunityEvents(communityID: string, userID: string) {
        return (await firstValueFrom((this.serviceFactory.get('events') as EventService).getUserCommunityEvents(communityID, userID))).data;
    }

    private async getCommunityAnnouncements(communityID: string) {
        return (await firstValueFrom((this.serviceFactory.get('communities') as CommunityService).getCommunityAnnouncements(communityID))).data;
    }

    private initializeSockets() {
        const communityUserSocket = (this.socketFactory.get('CommunityUser'));
        communityUserSocket.onInsert().subscribe(res => this.updateUserJoined(res.new as CommunityUser, true));
        communityUserSocket.onUpdate().subscribe(res => this.updateUserJoined(res.new as CommunityUser, true));
        communityUserSocket.onDelete().subscribe(res => this.updateUserJoined(res.old as CommunityUser, false));
        const requestSocket = (this.socketFactory.get('JoinRequests'));
        requestSocket.onInsert().subscribe(res => this.updateRequested(res.new as JoinRequest, true));
        requestSocket.onUpdate().subscribe(res => this.updateRequested(res.new as JoinRequest, false));
        requestSocket.onDelete().subscribe(res => this.updateRequested(res.old as JoinRequest, false));
        const eventUserSocket = (this.socketFactory.get('EventUser'));
        eventUserSocket.onInsert().subscribe(res => this.updateUserEvents(res.new as EventUser));
        eventUserSocket.onDelete().subscribe(res => this.updateUserEvents(res.old as EventUser));
        const eventsSocket = (this.socketFactory.get('Events'));
        eventsSocket.onInsert().subscribe(res => this.updateEvent(res.new as CommunityEvent, false));
        eventsSocket.onUpdate().subscribe(res => this.updateEvent(res.new as CommunityEvent, false));
        eventsSocket.onDelete().subscribe(res => this.updateEvent(res.old as CommunityEvent, true));
    }

    private updateEvent(event: CommunityEvent, removed: boolean) {
        console.log(event);
        if (event.communityID !== this.community?.id) return;
        if (removed) delete this.events[event.id!];
        else this.events[event.id!] = event;
    }

    private async checkIfIsUserModerator(communityID: string, userID: string) {
        return (await firstValueFrom((this.serviceFactory.get('communities') as CommunityService).isUserModerator(communityID, userID))).data.length > 0;
    }

    protected readonly RouterCommand = RouterCommand;
    protected readonly JoinCommunityCommand = JoinCommunityCommand;
    protected readonly RemoveCommunityCommand = RemoveCommunityCommand;
    protected readonly LeaveCommunityCommand = LeaveCommunityCommand;

    private updateRequested(joinRequest: JoinRequest, isRequested: boolean) {
        console.log(joinRequest)
        if (joinRequest.communityID !== this.community?.id || joinRequest.userID !== this.authService.getUserUUID()) return;
        this.isRequested = isRequested;
    }

    private async checkIfIsRequested(communityID: string, userID: string) {
        return (await firstValueFrom((this.serviceFactory.get('communities') as CommunityService).getUserJoinRequestOf(userID, [communityID]))).data.filter(r => r.status === RequestStatus.PENDING).length > 0;
    }

    protected readonly CancelJoinRequestCommunityCommand = CancelJoinRequestCommunityCommand;
    protected readonly JoinEventCommand = JoinEventCommand;
    protected readonly LeaveEventCommand = LeaveEventCommand;

    private updateUserEvents(eventUser: EventUser) {
        if (eventUser.userID !== this.authService.getUserUUID() || eventUser.communityID !== this.community?.id) return;
        this.userEvents = {};
        this.getUserCommunityEvents(this.community.id, this.authService.getUserUUID()).then(events => events.forEach(e => this.userEvents[e.id!] = e));
    }

    protected readonly Object = Object;

    showEventsRequestPanel() {
        this.eventsRequestPanelVisible = true;
    }

    closeEventsRequestPanel() {
        this.eventsRequestPanelVisible = false;
    }
}
