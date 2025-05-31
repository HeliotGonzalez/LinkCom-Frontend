import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../architecture/model/User';
import { ApiService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CommunityService } from '../../../architecture/services/CommunityService';
import { Notify } from '../../services/notify';
import { ServiceFactory } from '../../services/api-services/ServiceFactory.service';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.css'],
  imports: [CommonModule, RouterModule]                 
})
export class PersonalProfileComponent implements OnInit {
  userIdToShow: string | null = null;

  activeTab: 'about' | 'communities' | 'activities' = 'about';
  avatarFallback = 'LogoLinkComNegro.svg';
  user: User | null = null;
  ownerId: string = '';
  imagePath: string = 'LogoLinkComNegro.svg'

  constructor(private apiService: ApiService, private AuthService: AuthService, protected router: Router, private notify: Notify, private serviceFactory: ServiceFactory, private route: ActivatedRoute, private languageService: LanguageService) {
    this.ownerId = this.AuthService.getUserUUID();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idFromRoute = params.get('id');
      this.userIdToShow = idFromRoute ?? this.AuthService.getUserUUID();
      this.loadProfile(this.userIdToShow);
    });
  }

  loadProfile(id: string){
    this.apiService.getUserProfile(id).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        const data = response.data;
        const createdAt = new Date(data.created_at).toISOString();
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
        } as User;
        console.log('User data:', this.user);
      },
      error: (error: any) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  viewCommunity(communityID?: string): void {
    if (!communityID) { return; }
    this.router.navigate([{ outlets: { modal: null } }]).then(() => {
      this.router.navigate(['/community', communityID]);
    });
  }
  
  leaveCommunity(communityID?: string, name?: string): void {
    if (!communityID) { return; }

    let inform = (this.languageService.current == 'en') ? `You will be leaving ${name ?? 'this'} community` : `Vas a abanadonar ${name ?? 'esta'} comunidad`

    this.notify.confirm(inform)
      .then(confirmed => {
        if (!confirmed) { return; }

        (this.serviceFactory.get('communities') as CommunityService).leaveCommunity(communityID, this.AuthService.getUserUUID()).subscribe({
            next: () => {
              let text = (this.languageService.current == 'en') ? 'You have left this community!' : 'Abandonaste esta comunidad'
              this.notify.success(text);
              this.user!.communities = this.user!.communities?.filter(c => c.id !== communityID);
            },
            error: res => {
              if (this.languageService.current == 'en') this.notify.error(`An error occurred: ${res.message}`);
              else this.notify.error(`Hubo un error: ${res.message}`);
            }
          });
      }).then(() => {
        window.location.reload();
      });
  }

  editProfile(){
    this.router.navigate([{ outlets: { modal: null } }]).then(() => {
      this.router.navigate(['/edit-profile']);
    });
  }

  closeModal(){
    this.router.navigate([{ outlets: { modal: null } }]);
  }
}
