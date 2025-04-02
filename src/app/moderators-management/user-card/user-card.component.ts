import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() username!: string;
  @Input() role!: string;
  @Output() roleChanged = new EventEmitter<string>();

  get icon(): string {
    return this.role === 'moderator' ?  'fa-user-gear' : 'fa-user-plus';
  }

  toggleRole() {
    const newRole = this.role === 'moderator' ? 'member' : 'moderator';
    this.roleChanged.emit(newRole);
  }
}
