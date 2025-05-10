import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunityEvent} from "../../../architecture/model/CommunityEvent";
import {ImageDialogComponent} from "../image-dialog/image-dialog.component";
import {AuthService} from "../../services/auth.service";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Notify} from "../../services/notify";
import {EventState} from "../../../architecture/model/EventState";
import {AcceptEventCommand} from "../../commands/AcceptEventCommand";
import {RemoveEventCommand} from "../../commands/RemoveEventCommand";
import { EventService } from '../../../architecture/services/EventService';
import { Comment } from '../../../architecture/model/Comment';
import {CommentModalComponent} from "../comment-modal/comment-modal.component";

@Component({
    selector: 'app-event-view',
    imports: [
        ImageDialogComponent,
        CommentModalComponent,
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
    comments: Comment[] = [];


    ngOnInit() {
        if (this.event) {
            const eventId = this.event?.id ?? '';
            (this.serviceFactory.get('events') as EventService).getComments(eventId).subscribe({
                next: res => {
                    console.log('Comentarios obtenidos:', res.data);  // Muestra los comentarios en consola
                    this.comments = res.data.flat();  // Combina comentarios predefinidos y los obtenidos
                },
                error: res => this.notify.error(`We have problems getting the comments: ${res.message}`)
            });
        }
    }

    constructor(
        private authService: AuthService,
        protected serviceFactory: ServiceFactory,
        private notify: Notify
    ) {}

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
            error: res => this.notify.error(`We have problems adding you to this event: ${res.message}`)
        });
    }

    protected readonly EventState = EventState;

    acceptEvent() {}

    protected readonly AcceptEventCommand = AcceptEventCommand;
    protected readonly AuthService = AuthService;
    protected loggedUserID!: string;
    protected readonly RemoveEventCommand = RemoveEventCommand;

    parseDateTimeLocal(timestamp: string): string {
        const date = new Date(timestamp);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const dayOfWeek = days[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = months[date.getMonth()];
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const timeString = `${hours}:${minutes}`;

        return `${dayOfWeek} ${dayOfMonth}, ${month} ${timeString}`;
    }
}
