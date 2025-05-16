import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UserListCardComponent} from './user-list-card/user-list-card.component';
import {FriendRequestsPanelComponent} from '../../components/friend-requests-panel/friend-requests-panel.component';
import {ServiceFactory} from '../../services/api-services/ServiceFactory.service';
import {User} from '../../../architecture/model/User';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../../architecture/services/UserService';
import { Notify } from '../../services/notify';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule, UserListCardComponent, FriendRequestsPanelComponent],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  searchText: string = '';
  users: User[] = [];
  currentUserID!: string;
  showRequestsPanel: boolean = false;
  friends: string[] = [];
  filter: string = 'all';

  constructor(
    private serviceFactory: ServiceFactory,
    private auth: AuthService,
    private notify: Notify
  ) {}


  ngOnInit() {
    this.currentUserID = this.auth.getUserUUID();
    const userService = this.serviceFactory.get('users') as UserService;

    userService.getAllUsers().subscribe(res => {
      this.users = res.data.filter(user => user.id !== this.currentUserID);
    });

    userService.getFriends(this.currentUserID).subscribe(res => {
      this.friends = res.data.map((f: User) => f.id);
    });
  }


  filteredUsers(): User[] {
    if (this.filter === 'friends') {
      return this.users.filter(user => this.friends.includes(user.id) && user.username.toLowerCase().includes(this.searchText.toLowerCase()));
    }
    return this.users.filter(user => user.username.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  sendFriendRequest(user: User) {
    (this.serviceFactory.get('users') as UserService)
      .makeFriendRequest(this.currentUserID, user.id)
      .subscribe(() => {
        this.notify.success('Friend request sent!');
      });
  }

  toggleFriendRequestsPanel() {
    this.showRequestsPanel = !this.showRequestsPanel;
  }
}