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
import { EventCommentModalComponent } from '../../event-view/event-comment-modal/event-comment-modal.component';
import { Comment } from '../../../architecture/model/Comment';
import { EventService } from '../../../architecture/services/EventService';
@Component({
    selector: 'app-event-view',
    imports: [
    ImageDialogComponent,
    EventCommentModalComponent,
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
    protected isCommentModalVisible: boolean = false;
    notify: any;

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

    openCommentModal() {
        this.isCommentModalVisible = true;
    }
    
    closeCommentModal() {
        this.isCommentModalVisible = false;
    }

    createComment(comment: Comment) {
        console.log(comment.body);
        (this.serviceFactory.get('events') as EventService).createComment(comment).subscribe({
            next: () => {
                this.notify.success(`You have published a comment`);
                this.isCommentModalVisible = false;
            },
            error: (res: { message: any; }) => this.notify.error(`We have problems adding you to this event: ${res.message}`)
        });
      }
      
    protected readonly EventState = EventState;

    protected readonly AcceptEventCommand = AcceptEventCommand;
    protected readonly AuthService = AuthService;
    protected loggedUserID!: string;
    protected readonly RemoveEventCommand = RemoveEventCommand;
}
