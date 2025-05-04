import { Component } from '@angular/core';
import {FirstEventFormComponent} from "./first-event-form/first-event-form.component";

@Component({
  selector: 'app-first-event-form-card',
  imports: [
    FirstEventFormComponent
  ],
  templateUrl: './first-event-form-card.component.html',
  styleUrl: './first-event-form-card.component.css'
})
export class FirstEventFormCardComponent {

}
