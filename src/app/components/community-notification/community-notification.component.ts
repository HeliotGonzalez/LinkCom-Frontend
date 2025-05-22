import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Notification} from "../../../architecture/model/Notification";
import {Community} from "../../../architecture/model/Community";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Router} from "@angular/router";
import {LanguageService} from "../../language.service";
import {NotificationService} from "../../../architecture/services/NotificationService";
import {CommunityService} from "../../../architecture/services/CommunityService";

@Component({
    selector: 'app-community-notification',
    imports: [],
    templateUrl: './community-notification.component.html',
    styleUrl: './community-notification.component.css'
})
export class CommunityNotificationComponent {
    @Input() notificationID!: string;
    @Output() closeEmitter = new EventEmitter();

    protected notification!: Notification;
    protected related!: Community;

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
            (this.serviceFactory.get('communities') as CommunityService).getCommunity(this.notification.relatedID).subscribe(res => this.related = res.data[0]);
        });
    }

    goToRelated() {
        this.closeEmitter.emit();
        (this.serviceFactory.get('notifications') as NotificationService).remove(this.notificationID).subscribe();
        this.router.navigate(['/community', this.related.id]).then();
    }
}
