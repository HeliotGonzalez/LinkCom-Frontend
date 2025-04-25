import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../../services/api-service.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceFactory } from '../../../services/api-services/ServiceFactory.service';
import { CommunityService } from '../../../../architecture/services/CommunityService';
import { CommunityAnnouncement } from '../../../../architecture/model/CommunityAnnouncement';


@Component({
  selector: 'app-announcement-form',
  imports: [FormsModule],
  templateUrl: './announcement-form.component.html',
  styleUrl: './announcement-form.component.css'
})
export class AnnouncementFormComponent implements OnInit{

  private communityAnnouncement!: CommunityAnnouncement;

  protected title: string = "";
  protected body: string = "";
  private communityID!: string;
  private publisherID!: string;

  constructor (
    private router: Router,
    private baseRoute: ActivatedRoute,
    private serviceFactory: ServiceFactory, 
    private authService: AuthService
  ) {  
    this.publisherID = this.authService.getUserUUID();
  }

  ngOnInit(): void {
    this.baseRoute.queryParams.subscribe(params => {
      this.communityID = params["communityID"];
    });

  }

  setFocus(event: Event, input: HTMLInputElement | HTMLTextAreaElement | HTMLDivElement) {
    event.preventDefault();
    input.focus();
  }

  addTag(event: Event, input: HTMLInputElement) {
    const value = input.value.trim();
    event.preventDefault();
  }

  resetForm(){
    this.title = '';
    this.body = '';
  }

  exitForm(event: Event) {
    this.resetForm();
    this.router.navigate(["/communities"]);
  }

  submitData(event: Event){
    event.preventDefault();
    if (this.title.trim() === '' || this.body.trim() === '') {
      Swal.fire('Error', 'Title and description are required!', 'error');
      return;
    }

    this.communityAnnouncement = {
      title: this.title.trim(),
      body: this.body.trim(),
      communityID: this.communityID,
      publisherID: this.publisherID
    };

    (this.serviceFactory.get('communities') as CommunityService).createAnnouncement(this.communityAnnouncement).subscribe({
      next: (response: any) => {
        console.log(response);
        Swal.fire({
          title: "Operation success",
          icon: "success",
          confirmButtonText: "Continue"
        });
        this.router.navigate(["/community"], {queryParams: {communityID: this.communityID}});
      },
      error: (err: any) => {
        Swal.fire({
          title: "Operation error",
          text: "Database connection error",
          icon: "error",
          confirmButtonText: "Continue"
        });
        console.log(err);
      }
    });

    /*
    this.apiService.createAnnouncement(this.title, this.body, this.communityID, this.publisherID).subscribe({
      next: (response: any) => {
        console.log(response);
        Swal.fire({
          title: "Operation success",
          icon: "success",
          confirmButtonText: "Continue"
        });
        this.router.navigate(["/community"], {queryParams: {communityID: this.communityID}});
      },
      error: (err: any) => {
        Swal.fire({
          title: "Operation error",
          text: "Database connection error",
          icon: "error",
          confirmButtonText: "Continue"
        });
        console.log(err);
      }
    });*/
  }
}
