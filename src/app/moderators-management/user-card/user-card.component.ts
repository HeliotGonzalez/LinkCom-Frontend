import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() name!: string;
  @Input() role!: string;
  @Input() icon!: string;
  @Output() roleChanged = new EventEmitter<string>();

  toggleRole() {
    const newRole = this.role === 'MEMBER' ? 'MODERATOR' : 'MEMBER';
    this.role = newRole;
    this.icon = newRole === 'MEMBER' ? 'fa-user-plus' : 'fa-user-gear';
    this.roleChanged.emit(newRole);
  }
}
