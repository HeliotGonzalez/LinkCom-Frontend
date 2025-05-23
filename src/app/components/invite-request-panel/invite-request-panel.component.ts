import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../architecture/model/User';
import { UsersListComponent } from "../../pages/users-list/users-list.component";
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ServiceFactory } from '../../services/api-services/ServiceFactory.service';
import { CommunityService } from '../../../architecture/services/CommunityService';
import { WebSocketFactory } from '../../services/api-services/WebSocketFactory.service';
import { WebSocketService } from '../../../architecture/io/WebSocketService';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../architecture/services/UserService';
import { UserListCardComponent } from '../../pages/users-list/user-list-card/user-list-card.component';

@Component({
  selector: 'app-invite-request-panel',
  imports: [UserListCardComponent],
  templateUrl: './invite-request-panel.component.html',
  styleUrl: './invite-request-panel.component.css',
  animations: [
          trigger('fadeDialog', [
              state('void', style({ opacity: 0, transform: 'scale(0.95)' })),
              state('*', style({ opacity: 1, transform: 'scale(1)' })),
              transition(':enter', [
                  style({ opacity: 0, transform: 'scale(0.95)' }),
                  animate('200ms ease-out')
              ]),
              transition(':leave', [
                  animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
              ])
          ])
      ]
})
export class InviteRequestPanelComponent implements OnInit{

  protected communityID: string = "";
  private userUUID: string = "";
  protected friends: User[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceFactory: ServiceFactory,
    private socketFactory: WebSocketFactory,
    private authService: AuthService
  ) {
    this.userUUID = this.authService.getUserUUID()
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.communityID = params.get('id')!;
      const userService = this.serviceFactory.get('users') as UserService;
      const response = await firstValueFrom(userService.getFriends(this.userUUID));
      this.friends = response.data;
    });
  }
  
  invite(user: User) {
    /*const communityService = this.serviceFactory.get('communities') as CommunityService;
    communityService.inviteUserToCommunity(this.communityID, user.id!).subscribe({
      next: () => alert(`Invitación enviada a ${user.username}`),
      error: () => alert(`Error al invitar a ${user.username}`)
    });
    */
  }

  close() {
        this.router.navigate([{outlets:{ modal: null}}]).then();
    }
}
