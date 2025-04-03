import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Community } from '../../interfaces/community';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-community-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './community-card.component.html',
  styleUrl: './community-card.component.css'
})
export class CommunityCardComponent {
  @Input() community!: Community;
  @Input() isUserJoined: boolean = false;
  @Output() joinCommunityEmitter = new EventEmitter<Community>();
  @Output() leaveCommunityEmitter = new EventEmitter<Community>();

  constructor(private router: Router) {}

  viewCommunity() {
    this.router.navigate(['community'], {
      queryParams: {
        communityID: this.community.id,
        isUserJoined: this.isUserJoined
      }
    }).then();
  }

  joinCommunity() {
    this.joinCommunityEmitter.emit(this.community);
  }

  leaveCommunity() {
    this.leaveCommunityEmitter.emit(this.community);
  }
}
