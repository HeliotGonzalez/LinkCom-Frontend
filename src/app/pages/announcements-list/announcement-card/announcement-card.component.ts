import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api-service.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { ServiceFactory } from '../../../services/api-services/ServiceFactory.service';
import { CommunityService } from '../../../../architecture/services/CommunityService';
import { Router } from '@angular/router';
import { Announce } from '../../../interfaces/announce';

@Component({
    selector: 'app-announcement-card',
    imports: [],
    templateUrl: './announcement-card.component.html',
    standalone: true,
    styleUrl: './announcement-card.component.css'
})
export class AnnouncementCardComponent implements OnInit {
  
  @Input() announce!: Announce;
  @Input() imgPath!: string;
  userId!: string;  

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private apiService: ApiService,
    private serviceFactory: ServiceFactory
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserUUID(); 
  }

  // Método para eliminar el anuncio
  deleteAnnouncement(announcementId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This announcement will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        (this.serviceFactory.get('communities') as CommunityService).removeAnnouncement(announcementId).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Deleted!',
              text: 'This announcement has been deleted.',
              icon: 'success',              
            }).then(() => {
              window.location.reload(); 
            })
          },
          error: (error) => {
            Swal.fire({
              title: 'Error!',
              text: 'Could not delete the announcement.',
              icon: 'error',
              confirmButtonText: 'Retry',
            });
          }
        });

      }
    });
  }
}
