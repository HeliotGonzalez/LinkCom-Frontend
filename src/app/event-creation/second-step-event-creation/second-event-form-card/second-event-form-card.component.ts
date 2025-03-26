import { Component } from '@angular/core';
import {
  FirstEventFormComponent
} from "../../first-step-event-creation/first-event-form-card/first-event-form/first-event-form.component";
import {SecondEventFormComponent} from "./second-event-form/second-event-form.component";

@Component({
  selector: 'app-second-event-form-card',
  imports: [
    FirstEventFormComponent,
    SecondEventFormComponent
  ],
  templateUrl: './second-event-form-card.component.html',
  styleUrl: './second-event-form-card.component.css'
})
export class SecondEventFormCardComponent {

}
