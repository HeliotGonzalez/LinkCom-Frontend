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
import {User} from "../../../architecture/model/User";
import {UserService} from "../../../architecture/services/UserService";
import { EventCommentModalComponent } from '../event-comment-modal/event-comment-modal.component';
import { LanguageService } from '../../language.service';
import { RequestStatus } from '../../../architecture/model/RequestStatus';

@Component({
    selector: 'app-event-view',
    imports: [
        ImageDialogComponent,
        EventCommentModalComponent
    ],
    templateUrl: './event-view.component.html',
    standalone: true,
    styleUrl: './event-view.component.css'
})
export class EventViewComponent {
    @Input() event: CommunityEvent | null = null;
    @Input() eventID!: string;
    @Input() canRemove: boolean = true;
    @Input() isDisabled: boolean = true;
    @Output() joinEventEmitter = new EventEmitter();
    @Output() leaveEventEmitter = new EventEmitter();
    protected creator!: User;
    protected isDialogVisible: boolean = false;
    protected isCommentModalVisible: boolean = false;
    comments: Comment[] = [];
    protected members: User[] = [];
    protected queue: User[] = [];


    constructor(
        private authService: AuthService,
        protected serviceFactory: ServiceFactory,
        private notify: Notify,
        private languageService: LanguageService
    ) {}

    ngOnInit() {
        (this.serviceFactory.get('events') as EventService).getEvent(this.eventID).subscribe(res => {
            this.event = {...res.data[0]};
            (this.serviceFactory.get('users') as UserService).getUser(this.event.creatorID).subscribe( res => this.creator = res.data[0]);
            (this.serviceFactory.get('events') as EventService).getComments(this.eventID).subscribe({
                next: res => {
                    console.log('Comentarios obtenidos:', res.data);  // Muestra los comentarios en consola
                    this.comments = res.data.flat();  // Combina comentarios predefinidos y los obtenidos
                },
                error: res => {
                    if (this.languageService.current == 'en') this.notify.error(`We have problems getting the comments: ${res.message}`)
                    else this.notify.error(`Hemos encontrado un error al obtener los comentarios: ${res.message}`)
                } 
            });
            (this.serviceFactory.get('events') as EventService).getMembers(this.eventID).subscribe(res => this.members = res.data);
            (this.serviceFactory.get('events') as EventService).getEventQueue(this.eventID).subscribe(res => this.queue = res.data);
        });
    }

    joinEvent() {
        if (this.event?.slots) {
            if (this.members.length < this.event.slots) {
                this.joinEventEmitter.emit(RequestStatus.ACCEPTED);
            } else {
                const queueRequest = this.notify.confirm("The event slots are already full, do you want to get in queue?").then(res => {
                    if (res) {
                        this.joinEventEmitter.emit();
                    } else {
                        this.notify.info("Event info", "You didn't apply for the event queue, better luck next time!");
                    }
                })
                
            }
        } 

        this.joinEventEmitter.emit(RequestStatus.ACCEPTED);
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
        (this.serviceFactory.get('events') as EventService).createComment(comment).subscribe({
            next: () => {
                //if (this.languageService.current == 'en') this.notify.success(`You have published a comment`);
                //else this.notify.success(`Acabas de publicar un comentario`)
            },
            error: res => this.notify.error(`We have problems adding you to this event: ${res.message}`)
        });
    }

    protected readonly EventState = EventState;
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
