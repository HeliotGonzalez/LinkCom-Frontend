import { Component } from '@angular/core';
import { UserCardComponent } from './user-card/user-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-moderators-management',
  standalone: true,
  imports: [UserCardComponent, FormsModule],
  templateUrl: './moderators-management.component.html',
  styleUrls: ['./moderators-management.component.css']
})
export class ModeratorsManagementComponent {
  communityName: string = 'LinkCom';
  searchText: string = '';
  filterRole: string = 'ALL';

  members = [
    { name: 'John Doe', role: 'MODERATOR', icon: 'fa-user-gear' },
    { name: 'Jane Smith', role: 'MEMBER', icon: 'fa-user-plus' },
    { name: 'Alice Johnson', role: 'MODERATOR', icon: 'fa-user-gear' },
    { name: 'Bob Brown', role: 'MEMBER', icon: 'fa-user-plus' }
  ];

  get filteredMembers() {
    return this.members
      .filter(member =>
        (this.filterRole === 'ALL' || member.role === this.filterRole) &&
        member.name.toLowerCase().includes(this.searchText.toLowerCase())
      )
      .sort((a, b) => a.role === 'MODERATOR' ? -1 : 1);
  }

  updateRole(name: string, newRole: string) {
    const member = this.members.find(m => m.name === name);
    if (member) {
      member.role = newRole;
      member.icon = newRole === 'MODERATOR' ? 'fa-user-gear' : 'fa-user-plus';
    }
  }
}
