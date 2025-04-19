import {Component, Input} from '@angular/core';
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {ImageDialogComponent} from "../image-dialog/image-dialog.component";
import {AuthService} from "../services/auth.service";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {EventService} from "../../architecture/services/EventService";
import {Notify} from "../services/notify";

@Component({
    selector: 'app-event-view',
    imports: [
        ImageDialogComponent
    ],
    templateUrl: './event-view.component.html',
    standalone: true,
    styleUrl: './event-view.component.css'
})
export class EventViewComponent {
    @Input() event: CommunityEvent | null = null;
    @Input() isDisabled: boolean = true;
    protected isDialogVisible: boolean = false;

    constructor(
        private authService: AuthService,
        private serviceFactory: ServiceFactory,
        private notify: Notify
    ) {
    }

    joinEvent() {
        (this.serviceFactory.get('events') as EventService).joinEvent(this.event?.id!, this.authService.getUserUUID()).subscribe({
            next: () => {
                this.notify.success(`You have joined ${this.event?.title}`);
                this.isDisabled = true;
            },
            error: res => this.notify.error(`We have problems adding you to this event: ${res.message}`)
        });
    }

    leaveEvent() {
        this.notify.confirm(`Are you sure you want to leave ${this.event?.title} event?`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('events') as EventService).leaveEvent(this.event?.id!, this.authService.getUserUUID()).subscribe({
                next: () => {
                    this.notify.success(`You have left ${this.event?.title}`);
                    this.isDisabled = false;
                },
                error: res => this.notify.error(`We have problems adding you to this event: ${res.message}`)
            });
        });
    }

    openImageDialog() {
        this.isDialogVisible = true;
    }

    closeImageDialog() {
        this.isDialogVisible = false;
    }
}
