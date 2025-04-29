import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {ImageDialogComponent} from "../image-dialog/image-dialog.component";
import {AuthService} from "../services/auth.service";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {EventService} from "../../architecture/services/EventService";
import {Notify} from "../services/notify";
import {EventState} from "../../architecture/model/EventState";
import {AcceptEventCommand} from "../commands/AcceptEventCommand";

@Component({
    selector: 'app-event-view',
    imports: [
        ImageDialogComponent
    ],
    templateUrl: './event-view.component.html',
    standalone: true,
    styleUrl: './event-view.component.css'
})
export class EventViewComponent {
    @Input() event: CommunityEvent | null = null;
    @Input() isDisabled: boolean = true;
    @Output() joinEventEmitter = new EventEmitter();
    @Output() leaveEventEmitter = new EventEmitter();
    protected isDialogVisible: boolean = false;

    constructor(
        private authService: AuthService,
        protected serviceFactory: ServiceFactory,
        private notify: Notify
    ) {
    }

    joinEvent() {
        this.joinEventEmitter.emit();
    }

    leaveEvent() {
        this.leaveEventEmitter.emit();
    }

    openImageDialog() {
        this.isDialogVisible = true;
    }

    closeImageDialog() {
        this.isDialogVisible = false;
    }

    protected readonly EventState = EventState;

    acceptEvent() {

    }

    protected readonly AcceptEventCommand = AcceptEventCommand;
}
