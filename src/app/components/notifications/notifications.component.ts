import {Component, ElementRef, HostListener} from '@angular/core';
import {Notification} from "../../../architecture/model/Notification";
import {NotificationComponent} from "../notification/notification.component";
import {NotificationType} from "../../../architecture/model/NotificationType";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {NotificationService} from "../../../architecture/services/NotificationService";
import {AuthService} from "../../services/auth.service";
import {WebSocketFactory} from "../../services/api-services/WebSocketFactory.service";

@Component({
    selector: 'app-notifications',
    imports: [
        NotificationComponent
    ],
    templateUrl: './notifications.component.html',
    standalone: true,
    styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
    protected notifications: {[key: string]: Notification} = {};
    protected open: boolean = false;

    constructor(
        private eRef: ElementRef,
        private serviceFactory: ServiceFactory,
        private auth: AuthService,
        private sockets: WebSocketFactory
    ) {
    }

    ngOnInit() {
        (this.serviceFactory.get('notifications') as NotificationService).userNotifications(this.auth.getUserUUID()).subscribe(res => {
            res.data.forEach(n => this.notifications[n.id!] = n);
            this.initializeSockets();
        });
    }

    protected toggleOpen() {
        this.open = !this.open;
    }

    @HostListener('document:click', ['$event'])
    clickOutside(event: MouseEvent) {
        if (!this.eRef.nativeElement.contains(event.target)) this.open = false;
    }

    private initializeSockets() {
        const notifications = this.sockets.get('Notifications');
        notifications.onInsert().subscribe(res => this.onChangeNotification(res.new));
        notifications.onUpdate().subscribe(res => this.onChangeNotification(res.new));
        notifications.onDelete().subscribe(res => this.onRemoveNotification(res.old));
    }

    private onChangeNotification(notification: Notification) {
        if (notification.recipientID !== this.auth.getUserUUID()) return;
        this.notifications[notification.id!] = notification;
    }

    private onRemoveNotification(notification: Notification) {
        if (notification.recipientID !== this.auth.getUserUUID()) return;
        delete this.notifications[notification.id!];
    }

    protected readonly Object = Object;
}
