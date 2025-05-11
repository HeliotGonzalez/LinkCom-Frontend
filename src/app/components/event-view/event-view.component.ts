import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunityEvent} from "../../../architecture/model/CommunityEvent";
import {ImageDialogComponent} from "../image-dialog/image-dialog.component";
import {AuthService} from "../../services/auth.service";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Notify} from "../../services/notify";
import {EventState} from "../../../architecture/model/EventState";
import {AcceptEventCommand} from "../../commands/AcceptEventCommand";
import {RemoveEventCommand} from "../../commands/RemoveEventCommand";
<<<<<<< HEAD
=======
import { EventService } from '../../../architecture/services/EventService';
import { Comment } from '../../../architecture/model/Comment';
import {CommentModalComponent} from "../comment-modal/comment-modal.component";
<<<<<<< HEAD
>>>>>>> 16c35fc (fix: import error fixed.)
=======
import {User} from "../../../architecture/model/User";
import {UserService} from "../../../architecture/services/UserService";
>>>>>>> 28aa5d3 (feat: messages page developed. Message service implemented.)

@Component({
    selector: 'app-event-view',
    imports: [
<<<<<<< HEAD
        ImageDialogComponent
=======
        ImageDialogComponent,
        CommentModalComponent,
>>>>>>> 16c35fc (fix: import error fixed.)
    ],
    templateUrl: './event-view.component.html',
    standalone: true,
    styleUrl: './event-view.component.css'
})
export class EventViewComponent {
    @Input() eventID!: string;
    @Input() canRemove: boolean = true;
    @Input() isDisabled: boolean = true;
    @Output() joinEventEmitter = new EventEmitter();
    @Output() leaveEventEmitter = new EventEmitter();
    protected event!: CommunityEvent;
    protected creator!: User;
    protected isDialogVisible: boolean = false;
<<<<<<< HEAD
=======
    protected isCommentModalVisible: boolean = false;
    comments: Comment[] = [];

>>>>>>> 28aa5d3 (feat: messages page developed. Message service implemented.)

    constructor(
        protected serviceFactory: ServiceFactory
    ) {
    }

    ngOnInit() {
        this.loggedUserID = (this.serviceFactory.get('auth') as AuthService).getUserUUID();
    }

    ngOnInit() {
        (this.serviceFactory.get('events') as EventService).getEvent(this.eventID).subscribe(res => {
            this.event = {...res.data[0]};
            (this.serviceFactory.get('users') as UserService).getUser(this.event.creatorID).subscribe( res => this.creator = res.data[0]);
            (this.serviceFactory.get('events') as EventService).getComments(this.eventID).subscribe({
                next: res => {
                    console.log('Comentarios obtenidos:', res.data);  // Muestra los comentarios en consola
                    this.comments = res.data.flat();  // Combina comentarios predefinidos y los obtenidos
                },
                error: res => this.notify.error(`We have problems getting the comments: ${res.message}`)
            });
        });
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
<<<<<<< HEAD

=======
>>>>>>> 28aa5d3 (feat: messages page developed. Message service implemented.)
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
