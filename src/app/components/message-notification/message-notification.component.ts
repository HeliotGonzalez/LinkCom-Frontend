import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Notification} from "../../../architecture/model/Notification";
import {NotificationService} from "../../../architecture/services/NotificationService";
import {Message} from "../../../architecture/model/Message";
import {MessageService} from "../../../architecture/services/MessageService";
import {Router} from "@angular/router";

@Component({
    selector: 'app-message-notification',
    imports: [],
    templateUrl: './message-notification.component.html',
    styleUrl: './message-notification.component.css'
})
export class MessageNotificationComponent {
    @Input() notificationID!: string;
    @Output() closeEmitter = new EventEmitter();

    protected notification!: Notification;
    protected related!: Message;

    protected notificationMessageMap: {[key: string]: string} = {
        'community': 'The are new communities available!',
        'event': 'The are new events available!',
        'message': 'You have new messages to read',
        'friend_request': 'New friend request received',
        'event_request': 'Someone wants to publish a new event!',
        'join_request': 'Someone wants to join your community!'
    }

    constructor(
        private serviceFactory: ServiceFactory,
        protected router: Router
    ) {
    }

    ngOnInit() {
        (this.serviceFactory.get('notifications') as NotificationService).get(this.notificationID).subscribe(res => {
            this.notification = res.data[0];
            (this.serviceFactory.get('messages') as MessageService).get(this.notification.relatedID).subscribe(res => this.related = res.data[0]);
        });
    }

    goToChat() {
        this.closeEmitter.emit();
        this.router.navigate(['/messages', this.related.from]);
    }
}
