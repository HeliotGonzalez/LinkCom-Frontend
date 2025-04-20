import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "../../architecture/model/User";

@Component({
    selector: 'app-community-request',
    imports: [],
    templateUrl: './community-request.component.html',
    styleUrl: './community-request.component.css'
})
export class CommunityRequestComponent {
    @Input() user: User | null = null;
    @Output() rejectRequestEmitter = new EventEmitter<User>();
    @Output() acceptRequestEmitter = new EventEmitter<User>();

    rejectRequest() {
        this.rejectRequestEmitter.emit(this.user!);
    }

    acceptRequest() {
        this.acceptRequestEmitter.emit(this.user!);
    }
}
