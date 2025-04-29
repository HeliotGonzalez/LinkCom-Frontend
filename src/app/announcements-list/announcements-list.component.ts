import { Component, OnInit } from '@angular/core';
import { AnnouncementCardComponent } from "./announcement-card/announcement-card.component";
import { Announce } from '../interfaces/announce';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api-service.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { ɵnormalizeQueryParams } from '@angular/common';

@Component({
  selector: 'app-announcements-list',
  imports: [AnnouncementCardComponent],
  templateUrl: './announcements-list.component.html',
  styleUrl: './announcements-list.component.css'
})
export class AnnouncementsListComponent implements OnInit{
  protected announcements: Announce[] = [];
  protected communityID = '';
  protected communityName = '';
  protected communityImgPath = '';
  private userID = '';


  constructor (
    private router: Router,
    private baseRoute: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.userID = this.authService.getUserUUID();
  }

  async ngOnInit() {

    this.baseRoute.queryParams.subscribe(params => {
      this.communityID = params['communityID'];
      this.communityName = params['communityName'];
      this.communityImgPath = params['communityImgPath'];
    });

    if(this.userID === 'user_id') {
      Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'User not authenticated',
              confirmButtonText: 'Go back'
            });
            this.router.navigate([""]);
            return;
    } else {
      await this.fetchAnnouncements();
    }
  }

  async fetchAnnouncements(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(!this.communityID) {
        reject("CommunityID missing.");
        return;
      }
      
      this.apiService.getAnnouncements(this.communityID).subscribe({
        next: (res) => {
          if (res) {
            console.log(res);
            this.announcements = res.data;
            resolve();
          } else {
            reject("No data received");
          }
        },
        error: (err) => {
          console.error("Error fetching announcements", err);
          reject(err);
        }
      });
    });
  }

  exitPage(event: Event) {
    event.preventDefault();
    this.router.navigate(["/community"], {queryParams: {communityID: this.communityID, isUserJoined: true}});
  }


}
