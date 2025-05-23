import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Notification} from "../../../architecture/model/Notification";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../../architecture/services/NotificationService";
import {CommunityService} from "../../../architecture/services/CommunityService";
import {JoinRequest} from "../../../architecture/model/JoinRequest";
import {Community} from "../../../architecture/model/Community";
import { LanguageService } from '../../language.service';

@Component({
    selector: 'app-join-request-notification',
    imports: [],
    templateUrl: './join-request-notification.component.html',
    styleUrl: './join-request-notification.component.css'
})
export class JoinRequestNotificationComponent {
    @Input() notificationID!: string;
    @Output() closeEmitter = new EventEmitter();

    protected notification!: Notification;
    protected related!: JoinRequest;
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
        if (this.languageService.current == 'es'){
            this.notificationMessageMap = {
                'community': 'Hay nuevas comunidades disponibles',
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
            (this.serviceFactory.get('communities') as CommunityService).getJoinRequest(this.notification.relatedID).subscribe(res => {
                this.related = res.data[0];
                (this.serviceFactory.get('communities') as CommunityService).getCommunity(this.related.communityID).subscribe(res => this.community = res.data[0]);
            });
        });
    }

    goToRelated() {
        this.closeEmitter.emit();
        this.router.navigate(['/community', this.related.communityID]).then(() => this.router.navigate([{outlets:{modal:['communityRequestsPanel', this.related.communityID]}}]));
    }
}
