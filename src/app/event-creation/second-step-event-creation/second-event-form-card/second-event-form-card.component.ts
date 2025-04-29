import { Component } from '@angular/core';
import {SecondEventFormComponent} from "./second-event-form/second-event-form.component";

@Component({
  selector: 'app-second-event-form-card',
  imports: [
    SecondEventFormComponent
  ],
  templateUrl: './second-event-form-card.component.html',
  styleUrl: './second-event-form-card.component.css'
})
export class SecondEventFormCardComponent {

}
