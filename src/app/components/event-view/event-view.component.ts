import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunityEvent} from "../../../architecture/model/CommunityEvent";
import {ImageDialogComponent} from "../image-dialog/image-dialog.component";
import {AuthService} from "../../services/auth.service";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Notify} from "../../services/notify";
import {EventState} from "../../../architecture/model/EventState";
import {AcceptEventCommand} from "../../commands/AcceptEventCommand";
import {JoinEventCommand} from "../../commands/JoinEventCommand";
import {RemoveEventCommand} from "../../commands/RemoveEventCommand";

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
    @Input() canRemove: boolean = true;
    @Input() isDisabled: boolean = true;
    @Output() joinEventEmitter = new EventEmitter();
    @Output() leaveEventEmitter = new EventEmitter();
    protected isDialogVisible: boolean = false;

    constructor(
        protected serviceFactory: ServiceFactory
    ) {
    }

    ngOnInit() {
        this.loggedUserID = (this.serviceFactory.get('auth') as AuthService).getUserUUID();
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

    protected readonly AcceptEventCommand = AcceptEventCommand;
    protected readonly AuthService = AuthService;
    protected loggedUserID!: string;
    protected readonly RemoveEventCommand = RemoveEventCommand;
}
