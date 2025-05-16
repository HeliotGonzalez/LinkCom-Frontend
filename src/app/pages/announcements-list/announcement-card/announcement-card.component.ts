import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../../services/api-service.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { ServiceFactory } from '../../../services/api-services/ServiceFactory.service';
import { CommunityService } from '../../../../architecture/services/CommunityService';
import { Router } from '@angular/router';
import { Announce } from '../../../interfaces/announce';
import { CommunityAnnouncement } from '../../../../architecture/model/CommunityAnnouncement';
import { Notify } from '../../../services/notify';

@Component({
    selector: 'app-announcement-card',
    imports: [],
    templateUrl: './announcement-card.component.html',
    standalone: true,
    styleUrl: './announcement-card.component.css'
})
export class AnnouncementCardComponent implements OnInit {
  
  @Input() announce!: CommunityAnnouncement;
  @Input() imgPath!: string;
  @Output() deleted = new EventEmitter<string>();
  userId!: string;  

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private apiService: ApiService,
    private serviceFactory: ServiceFactory,
    private notify: Notify
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserUUID(); 
  }

  // Método para eliminar el anuncio
  deleteAnnouncement(announcementId: string) {
    this.notify.confirm("This announcement will be deleted!").then(() => {
      (this.serviceFactory.get('communities') as CommunityService).removeAnnouncement(announcementId).subscribe({
        next: () => {
          this.notify.success("This announcement has been deleted.");
          this.deleted.emit(announcementId);
        },
        error: (err) => {
          this.notify.error(err, "Error deleting the announcement");
        }
      })
    })
  }
}
