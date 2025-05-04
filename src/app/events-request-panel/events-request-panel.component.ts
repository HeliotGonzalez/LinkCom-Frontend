import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {firstValueFrom} from "rxjs";
import {CommunityService} from "../../architecture/services/CommunityService";
import {EventViewComponent} from "../event-view/event-view.component";
import {LeaveEventCommand} from "../commands/LeaveEventCommand";
import {JoinEventCommand} from "../commands/JoinEventCommand";
import {AuthService} from "../services/auth.service";

@Component({
    selector: 'app-events-request-panel',
    imports: [
        EventViewComponent

    ],
    templateUrl: './events-request-panel.component.html',
    styleUrl: './events-request-panel.component.css'
})
export class EventsRequestPanelComponent {
    @Input() isVisible!: boolean;
    @Output() eventEmitter = new EventEmitter();
    @Input() eventRequests: {[key: string]: CommunityEvent} = {};

    constructor(
        protected serviceFactory: ServiceFactory,
        protected authService: AuthService
    ) {
    }

    async ngOnInit() {
    }

    close() {
        this.eventEmitter.emit();
    }

    protected readonly LeaveEventCommand = LeaveEventCommand;
    protected readonly JoinEventCommand = JoinEventCommand;
    protected readonly Object = Object;
}
