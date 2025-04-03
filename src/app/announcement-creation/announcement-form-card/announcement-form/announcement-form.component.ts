import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../../services/api-service.service';
import { FeedItem } from '../../../interfaces/feed-item';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-announcement-form',
  imports: [FormsModule],
  templateUrl: './announcement-form.component.html',
  styleUrl: './announcement-form.component.css'
})
export class AnnouncementFormComponent implements OnInit{

  anData = {
    title: '',
    description: '',
    interests: [] as string[]
  }


  private userId;

  constructor (
    private router: Router,
    private apiService: ApiService, 
    private authService: AuthService,
  ) {
    this.userId = authService.getUserUUID();
  }

  ngOnInit(): void {
    
    if (this.userId === 'user_id') {
      console.error("Usuario no autenticado.")
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User not authenticated',
        confirmButtonText: 'Go back'
      });
      this.router.navigate(["/communities"]);
      return;
    }

    

  }

  setFocus(event: Event, input: HTMLInputElement | HTMLTextAreaElement | HTMLDivElement) {
    event.preventDefault();
    input.focus();
  }

  /*
  addTag(event: Event, input: HTMLInputElement, container: HTMLDivElement){
    this.setFocus(event, input);
    const tag = document.createElement("button");
    tag.classList.add("tag");
    tag.innerHTML = `<button (click)="removeTag($event, this, ${container})">#${input.value} &times;</button>`;
    container.append(tag);
    input.value = "";
  }
  */

  addTag(event: Event, input: HTMLInputElement) {
    const value = input.value.trim();

    if (value) {
      this.anData.interests.push(value);
      input.value = '';
    }

    event.preventDefault();
  }

  removeTag(index: number){
    this.anData.interests.splice(index, 1)
  }

  resetForm(){
    this.anData.title = '';
    this.anData.description = '';
    this.anData.interests = [];
  }

  exitForm(event: Event) {
    this.resetForm();
    this.router.navigate(["/communities"]);
  }

  submitData(event: Event){
    event.preventDefault();
    if (this.anData.title.trim() === '' || this.anData.description.trim() === '') {
      Swal.fire('Error', 'Title and description are required!', 'error');
      return;
    }


    console.log('Announcement Submitted:', this.anData);
    Swal.fire('Success', 'Announcement created successfully!', 'success');

    // Reset form
  }

}
