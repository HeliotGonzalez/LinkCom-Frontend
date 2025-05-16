import {Component, Input} from '@angular/core';
import {User} from "../../../architecture/model/User";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {UserService} from "../../../architecture/services/UserService";
import {MessageService} from "../../../architecture/services/MessageService";
import {AuthService} from "../../services/auth.service";
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-user-card',
    imports: [
        NgClass
    ],
    templateUrl: './user-card.component.html',
    standalone: true,
    styleUrl: './user-card.component.css'
})
export class UserCardComponent {
    @Input() userID!: string;
    @Input() chatID!: string;
    @Input() active!: boolean;

    protected user!: User;

    constructor(
        private serviceFactory: ServiceFactory,
        private auth: AuthService
    ) {
    }

    ngOnInit() {
        console.log(this.active);
        (this.serviceFactory.get('users') as UserService).getUser(this.userID).subscribe(res => this.user = res.data[0]);
    }

    hideChat() {
        (this.serviceFactory.get('messages') as MessageService).hideChatBetween(this.auth.getUserUUID(), this.userID).subscribe();
    }
}
