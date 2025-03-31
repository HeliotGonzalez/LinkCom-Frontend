import { Component } from '@angular/core';
import {FirstEventFormCardComponent} from "./first-event-form-card/first-event-form-card.component";

@Component({
  selector: 'app-first-step-event-creation',
  imports: [
    FirstEventFormCardComponent
  ],
  templateUrl: './first-step-event-creation.component.html',
  styleUrl: './first-step-event-creation.component.css'
})
export class FirstStepEventCreationComponent {

}
