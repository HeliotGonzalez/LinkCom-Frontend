import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../../../../architecture/model/User';
import {Router} from '@angular/router';

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

    constructor(private router: Router) {
    }

    requestFriend() {
        this.addFriend.emit(this.user);
    }

    viewProfile() {
        this.router.navigate([{outlets: {modal: ['profile', this.user.id]}}]);
    }

    goToChat() {
        this.router.navigate(['messages', this.user.id]).then();
    }
}
