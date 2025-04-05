import {Component, Input} from '@angular/core';
import {CommunityEvent} from "../model/CommunityEvent";
import {ImageDialogComponent} from "../image-dialog/image-dialog.component";
import {ApiService} from "../services/api-service.service";
import {AuthService} from "../services/auth.service";

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

    constructor(private apiService: ApiService, private authService: AuthService) {
    }

    joinEvent() {
        this.apiService.joinEvent(this.authService.getUserUUID(), this.event?.communityID!, this.event?.id!)
            .subscribe({
                next: res => {
                    console.log(res);
                    this.isDisabled = true;
                }
            });
    }

    leaveEvent() {
        this.apiService.leaveEvent(this.authService.getUserUUID(), this.event?.id!)
            .subscribe({
                next: res => {
                    console.log(res);
                    this.isDisabled = false;
                }
            });
    }

    openImageDialog() {
        this.isDialogVisible = true;
    }

    closeImageDialog() {
        this.isDialogVisible = false;
    }
}
