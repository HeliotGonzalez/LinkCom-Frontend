import { Component } from '@angular/core';
import { AnnouncementFormCardComponent } from "./announcement-form-card/announcement-form-card.component";

@Component({
  selector: 'app-announcement-creation',
  imports: [AnnouncementFormCardComponent],
  templateUrl: './announcement-creation.component.html',
  styleUrl: './announcement-creation.component.css'
})
export class AnnouncementCreationComponent {

}
