import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../../../../architecture/model/User';

@Component({
  selector: 'app-user-list-card',
  standalone: true,
  templateUrl: './user-list-card.component.html',
  styleUrls: ['./user-list-card.component.css']
})
export class UserListCardComponent {
  @Input() user!: User;
  @Output() addFriend = new EventEmitter<User>();

  requestFriend() {
    this.addFriend.emit(this.user);
  }
}
