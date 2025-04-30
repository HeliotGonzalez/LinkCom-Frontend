import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../architecture/model/User';
import { ApiService } from '../services/api-service.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommunityService } from '../../architecture/services/CommunityService';
import { Notify } from '../services/notify';
import { ServiceFactory } from '../services/api-services/ServiceFactory.service';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.css'],
  imports: [CommonModule]                 
})
export class PersonalProfileComponent implements OnInit {
  @Input() parentUser: User | null = null;

  activeTab: 'about' | 'communities' | 'activities' = 'about';
  avatarFallback = 'assets/img/default-avatar.png';
  user: User | null = null;
  ownerId: string = '';

  constructor(private apiService: ApiService, private AuthService: AuthService, protected router: Router, private notify: Notify, private serviceFactory: ServiceFactory) {
    this.ownerId = this.AuthService.getUserUUID();
  }



  ngOnInit(): void {
    if (this.parentUser){
      this.user = this.parentUser;
      return;
    }
    this.apiService.getUserProfile(this.AuthService.getUserUUID()).subscribe({
      next: (response: any) => {
      const data = response.data;
      const createdAt = new Date(data.created_at);
      const communities = data.communities.map((c: any) => ({
        ...c,
        created_at: new Date(c.created_at)
      }));

      this.user = {id: data.id, username: data.username, description: data.description, email: data.email, imagePath: data.imagePath,
        created_at: createdAt, interests: data.interests,
        stats: {
          communities: data.stats.communities,
          eventsJoined: data.stats.eventsJoined
        }, communities
      };
      },
      error: (error: any) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  viewCommunity(communityID?: string): void {
    if (!communityID) { return; }
    this.router.navigate(['/community'], { queryParams: { communityID } });
  }
  
  leaveCommunity(communityID?: string, name?: string): void {
    if (!communityID) { return; }

    this.notify.confirm(`You will be leaving ${name ?? 'this'} community`)
      .then(confirmed => {
        if (!confirmed) { return; }

        (this.serviceFactory.get('communities') as CommunityService)
          .leaveCommunity(communityID, this.AuthService.getUserUUID())
          .subscribe({
            next: () => {
              this.notify.success('You have left this community!');
              this.user!.communities =
                this.user!.communities.filter(c => c.id !== communityID);
            },
            error: res => this.notify.error(`An error occurred: ${res.message}`)
          });
      });
  }
}
