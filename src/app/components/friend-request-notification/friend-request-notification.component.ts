import {Component, EventEmitter, Input, makeStateKey, Output} from '@angular/core';
import {Notification} from "../../../architecture/model/Notification";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Router} from "@angular/router";
import {LanguageService} from "../../language.service";
import {NotificationService} from "../../../architecture/services/NotificationService";
import {FriendRequest} from "../../../architecture/model/FriendRequest";
import {User} from "../../../architecture/model/User";
import {UserService} from "../../../architecture/services/UserService";
import {RequestStatus} from "../../../architecture/model/RequestStatus";
import {NotificationType} from "../../../architecture/model/NotificationType";
import {AuthService} from "../../services/auth.service";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
    selector: 'app-friend-request-notification',
    imports: [],
    templateUrl: './friend-request-notification.component.html',
    styleUrl: './friend-request-notification.component.css'
})
export class FriendRequestNotificationComponent {
    @Input() notificationID!: string;
    @Output() closeEmitter = new EventEmitter();

    protected notification!: Notification;
    protected related!: FriendRequest;
    protected user!: User;

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
        private languageService: LanguageService,
        private auth: AuthService
    ) {
        if (this.languageService.current == 'es') {
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
            (this.serviceFactory.get('users') as UserService).getRequest(this.notification.relatedID).subscribe(res => {
                this.related = res.data[0];
                console.log(this.related);
                (this.serviceFactory.get('users') as UserService).getUser(this.related.from === this.auth.getUserUUID() ? this.related.to : this.related.from).subscribe(res => this.user = res.data[0]);
            });
        });
    }

    deny() {
        (this.serviceFactory.get('users') as UserService).cancelFriendRequest(this.related.from, this.related.to).subscribe();
        (this.serviceFactory.get('notifications') as NotificationService).removeFromRelated([this.related.id!]).subscribe();
    }

    accept() {
        (this.serviceFactory.get('users') as UserService).updateFriendRequest(this.related.from, this.related.to, RequestStatus.ACCEPTED).subscribe();
        (this.serviceFactory.get('notifications') as NotificationService).removeFromRelated([this.related.id!]).subscribe();
        (this.serviceFactory.get('notifications') as NotificationService).send({
            recipientID: this.related.from,
            relatedID: this.related.id!,
            type: NotificationType.FRIEND_REQUEST
        }).subscribe();
        (this.serviceFactory.get('notifications') as NotificationService).send({
            recipientID: this.related.to,
            relatedID: this.related.id!,
            type: NotificationType.FRIEND_REQUEST
        }).subscribe();
    }

    protected readonly RequestStatus = RequestStatus;

    markAsSeen() {
        (this.serviceFactory.get('notifications') as NotificationService).remove(this.notificationID).subscribe();
    }
}
