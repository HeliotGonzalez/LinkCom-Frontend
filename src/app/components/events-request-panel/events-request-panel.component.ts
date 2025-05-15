import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {CommunityEvent} from "../../../architecture/model/CommunityEvent";
import {EventViewComponent} from "../event-view/event-view.component";
import {LeaveEventCommand} from "../../commands/LeaveEventCommand";
import {JoinEventCommand} from "../../commands/JoinEventCommand";
import {AuthService} from "../../services/auth.service";
import {WebSocketFactory} from "../../services/api-services/WebSocketFactory.service";
import {WebSocketService} from "../../../architecture/io/WebSocketService";
import {EventState} from "../../../architecture/model/EventState";
import {ActivatedRoute, Router} from "@angular/router";
import {CommunityService} from "../../../architecture/services/CommunityService";

@Component({
    selector: 'app-events-request-panel',
    imports: [
        EventViewComponent
    ],
    templateUrl: './events-request-panel.component.html',
    standalone: true,
    styleUrl: './events-request-panel.component.css'
})
export class EventsRequestPanelComponent {
    communityID!: string;
    eventRequests: {[key: string]: CommunityEvent} = {};

    constructor(
        protected serviceFactory: ServiceFactory,
        protected socketFactory: WebSocketFactory,
        protected authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    async ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.communityID = params.get('id')!;
            (this.serviceFactory.get('communities') as CommunityService).getPendingCommunityEventsRequests(params.get('id')!).subscribe(res =>  res.data.forEach(e => this.eventRequests[e.id!] = e));
        });
        const eventsSocket = (this.socketFactory.get('Events') as WebSocketService<CommunityEvent>);
        eventsSocket.onUpdate().subscribe(res => this.onUpdateEvents(res.new as CommunityEvent))
        eventsSocket.onInsert().subscribe(res => this.onUpdateEvents(res.new as CommunityEvent))
        eventsSocket.onDelete().subscribe(res => this.onDeleteEvent(res.old as CommunityEvent))
    }

    close() {
        this.router.navigate([{outlets:{ modal: null}}]).then();
    }

    protected readonly LeaveEventCommand = LeaveEventCommand;
    protected readonly JoinEventCommand = JoinEventCommand;
    protected readonly Object = Object;

    private onUpdateEvents(event: CommunityEvent) {
        if (event.communityID !== this.communityID) return;
        if (event.eventState === EventState.PUBLISHED) delete this.eventRequests[event.id!];
        else this.eventRequests[event.id!] = event;
    }

    private onDeleteEvent(event: CommunityEvent) {
        if (event.communityID !== this.communityID) return;
        delete this.eventRequests[event.id!];
    }
}
