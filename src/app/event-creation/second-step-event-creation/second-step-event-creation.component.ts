import { Component } from '@angular/core';
import {
    FirstEventFormCardComponent
} from "../first-step-event-creation/first-event-form-card/first-event-form-card.component";
import {SecondEventFormCardComponent} from "./second-event-form-card/second-event-form-card.component";

@Component({
  selector: 'app-second-step-event-creation',
    imports: [
        FirstEventFormCardComponent,
        SecondEventFormCardComponent
    ],
  templateUrl: './second-step-event-creation.component.html',
  styleUrl: './second-step-event-creation.component.css'
})
export class SecondStepEventCreationComponent {

}
