import { Component } from '@angular/core';
import {
  FirstCommunityFormCardComponent
} from '../../community-creation/first-step-community-creation/first-community-form-card/first-community-form-card.component';
import {FirstEventFormCardComponent} from "./first-event-form-card/first-event-form-card.component";

@Component({
  selector: 'app-first-step-event-creation',
  imports: [
    FirstCommunityFormCardComponent,
    FirstEventFormCardComponent
  ],
  templateUrl: './first-step-event-creation.component.html',
  styleUrl: './first-step-event-creation.component.css'
})
export class FirstStepEventCreationComponent {

}
