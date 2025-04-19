import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunityRole} from "../../../architecture/model/CommunityRole";

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() username!: string;
  @Input() role!: CommunityRole;
  @Output() roleChanged = new EventEmitter<CommunityRole>();

  get icon(): string {
    return this.role === CommunityRole.MODERATOR ?  'fa-user-gear' : 'fa-user-plus';
  }

  toggleRole() {
    const newRole: CommunityRole = this.role === CommunityRole.MODERATOR ? CommunityRole.MEMBER : CommunityRole.MODERATOR;
    this.roleChanged.emit(newRole);
  }

  protected readonly CommunityRole = CommunityRole;
}
