import { Component } from '@angular/core';
import {SecondEventFormCardComponent} from "./second-event-form-card/second-event-form-card.component";

@Component({
  selector: 'app-second-step-event-creation',
    imports: [
        SecondEventFormCardComponent
    ],
  templateUrl: './second-step-event-creation.component.html',
  styleUrl: './second-step-event-creation.component.css'
})
export class SecondStepEventCreationComponent {

}
