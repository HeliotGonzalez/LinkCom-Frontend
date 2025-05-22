import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Notification} from "../../../architecture/model/Notification";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Router} from "@angular/router";
import {LanguageService} from "../../language.service";
import {NotificationService} from "../../../architecture/services/NotificationService";
import {EventService} from "../../../architecture/services/EventService";
import {CommunityEvent} from "../../../architecture/model/CommunityEvent";
import {Community} from "../../../architecture/model/Community";
import {CommunityService} from "../../../architecture/services/CommunityService";

@Component({
    selector: 'app-event-request-notification',
    imports: [],
    templateUrl: './event-request-notification.component.html',
    styleUrl: './event-request-notification.component.css'
})
export class EventRequestNotificationComponent {
    @Input() notificationID!: string;
    @Output() closeEmitter = new EventEmitter();

    protected notification!: Notification;
    protected related!: CommunityEvent;
    protected community!: Community;

    protected notificationMessageMap: { [key: string]: string } = {
        'community': 'The are new communities available!',
        'event': 'The are new events available!',
        'message': 'You have new messages to read',
        'friend_request': 'New friend request received',
        'event_request': 'Someone wants to publish a new event!',
        'join_request': 'Someone wants to join your community!'
    }

    constructor(
        private serviceFactory: ServiceFactory,
        protected router: Router,
        private languageService: LanguageService
    ) {
        if (this.languageService.current == 'es') {
            this.notificationMessageMap = {
                'community': 'Nueva comunidad disponible',
                'event': 'Hay nuevos eventos disponibles',
                'message': 'Tienes nuevos mensajes',
                'friend_request': 'Nueva solicitud de amistad recibida',
                'event_request': 'Alguien quiere publicar un nuevo evento',
                'join_request': 'Alguien quiere unirse a tu comunidad'
            }
        }
    }

    ngOnInit() {
        (this.serviceFactory.get('notifications') as NotificationService).get(this.notificationID).subscribe(res => {
            this.notification = res.data[0];
            (this.serviceFactory.get('events') as EventService).getEvent(this.notification.relatedID).subscribe(res => {
                this.related = res.data[0];
                (this.serviceFactory.get('communities') as CommunityService).getCommunity(this.related.communityID).subscribe(res => this.community = res.data[0]);
            });
        });
    }

    goToRelated() {
        this.closeEmitter.emit();
        this.router.navigate(['/community', this.related.communityID]).then(() => this.router.navigate([{outlets:{modal:['eventsRequestPanel', this.related.communityID]}}]));
    }
}
