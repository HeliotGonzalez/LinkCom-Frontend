import { Component } from '@angular/core';
import { AnnouncementFormComponent } from "./announcement-form/announcement-form.component";

@Component({
  selector: 'app-announcement-form-card',
  imports: [AnnouncementFormComponent],
  templateUrl: './announcement-form-card.component.html',
  styleUrl: './announcement-form-card.component.css'
})
export class AnnouncementFormCardComponent {

}
