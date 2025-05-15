import {Component, Input} from '@angular/core';
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Notification} from "../../../architecture/model/Notification";
import {NotificationService} from "../../../architecture/services/NotificationService";

@Component({
    selector: 'app-notification',
    imports: [],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css'
})
export class NotificationComponent {
    @Input() notificationID!: string;

    protected notification!: Notification;

    protected notificationMessageMap: {[key: string]: string} = {
        'community': 'The are new communities available!',
        'event': 'The are new events available!',
        'message': 'You have new messages to read',
        'friend_request': 'New friend request received',
        'event_request': 'Someone wants to publish a new event!',
        'join_request': 'Someone wants to join your community!'
    }

    constructor(
        private serviceFactory: ServiceFactory
    ) {
    }

    ngOnInit() {
        (this.serviceFactory.get('notifications') as NotificationService).get(this.notificationID).subscribe(res => {
            this.notification = res.data[0];
            console.log(this.notificationMessageMap[this.notification.type.toString()]);
        });
    }
}
