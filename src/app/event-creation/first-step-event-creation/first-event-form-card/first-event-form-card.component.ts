import { Component } from '@angular/core';
import {
  FirstCommunityFormComponent
} from '../../../community-creation/first-step-community-creation/first-community-form-card/first-community-form/first-community-form.component';
import {FirstEventFormComponent} from "./first-event-form/first-event-form.component";

@Component({
  selector: 'app-first-event-form-card',
  imports: [
    FirstCommunityFormComponent,
    FirstEventFormComponent
  ],
  templateUrl: './first-event-form-card.component.html',
  styleUrl: './first-event-form-card.component.css'
})
export class FirstEventFormCardComponent {

}
