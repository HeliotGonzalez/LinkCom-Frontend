import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {ImageDialogComponent} from "../image-dialog/image-dialog.component";
import {AuthService} from "../services/auth.service";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {EventService} from "../../architecture/services/EventService";
import {Notify} from "../services/notify";
import { EventCommentModalComponent } from "./event-comment-modal/event-comment-modal.component";
import { Comment } from '../../architecture/model/Comment';
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
    @Input() isDisabled: boolean = true;
    @Output() joinEventEmitter = new EventEmitter();
    @Output() leaveEventEmitter = new EventEmitter();
    protected isDialogVisible: boolean = false;
    protected isCommentModalVisible: boolean = false;

    constructor(
        private authService: AuthService,
        private serviceFactory: ServiceFactory,
        private notify: Notify
    ) {
    }

    joinEvent() {
        this.joinEventEmitter.emit();
    }

    leaveEvent() {
        this.notify.confirm(`Are you sure you want to leave ${this.event?.title} event?`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('events') as EventService).leaveEvent(this.event?.id!, this.authService.getUserUUID()).subscribe({
                next: () => {
                    this.notify.success(`You have left ${this.event?.title}`);
                    this.isDisabled = false;
                },
                error: res => this.notify.error(`We have problems adding you to this event: ${res.message}`)
            });
        });
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
            error: res => this.notify.error(`We have problems adding you to this event: ${res.message}`)
        });
      }
      
}
