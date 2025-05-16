import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../services/api-service.service';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceFactory } from '../../../../services/api-services/ServiceFactory.service';
import { CommunityService } from '../../../../../architecture/services/CommunityService';
import { CommunityAnnouncement } from '../../../../../architecture/model/CommunityAnnouncement';
import { Notify } from '../../../../services/notify';


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
    private authService: AuthService,
    private notify: Notify
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
    console.log(this.communityID);
    this.router.navigate([`community`, this.communityID]);
  }

  submitData(event: Event){
    event.preventDefault();
    if (this.title.trim() === '' || this.body.trim() === '') {
      this.notify.error('Title and description are required', 'Empty fields');
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
        this.notify.success('News has been published!');
        this.router.navigate(["community", this.communityID]);
      },
      error: (err: any) => {
        this.notify.error('There has been an error trying to publish the announcement. Try again later.', 'Operation error');
        console.log(err);
      }
    });
  }
}
