import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../../../../architecture/model/User';
import {Router} from '@angular/router';
import {ServiceFactory} from "../../../services/api-services/ServiceFactory.service";
import {MessageService} from "../../../../architecture/services/MessageService";
import {AuthService} from "../../../services/auth.service";
import {UserService} from "../../../../architecture/services/UserService";
import {firstValueFrom} from "rxjs";

@Component({
    selector: 'app-user-list-card',
    standalone: true,
    templateUrl: './user-list-card.component.html',
    styleUrls: ['./user-list-card.component.css']
})
export class UserListCardComponent {
    @Input() user!: User;
    @Input() isFriend: boolean = false;
    @Output() addFriend = new EventEmitter<User>();

    constructor(private router: Router, private serviceFactory: ServiceFactory, private auth: AuthService) {
    }

    requestFriend() {
        this.addFriend.emit(this.user);
    }

    viewProfile() {
        this.router.navigate([{outlets: {modal: ['profile', this.user.id]}}]);
    }

    async goToChat() {
        (this.serviceFactory.get('messages') as MessageService).createChat({
            from: this.auth.getUserUUID(),
            fromUsername: (await firstValueFrom((this.serviceFactory.get('users') as UserService).getUser(this.auth.getUserUUID()))).data[0].username,
            hidden: false,
            last_used_at: new Date().toISOString(),
            to: this.user.id!,
            toUsername: this.user.username
        }).subscribe();
        this.router.navigate(['messages', this.user.id]).then();
    }
}
