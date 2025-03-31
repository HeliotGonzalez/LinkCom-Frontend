import { Component } from '@angular/core';
import {
  FirstCommunityFormComponent
} from '../../first-step-community-creation/first-community-form-card/first-community-form/first-community-form.component';
import {SecondCommunityFormComponent} from './second-community-form/second-community-form.component';

@Component({
  selector: 'app-second-community-form-card',
  imports: [
    FirstCommunityFormComponent,
    SecondCommunityFormComponent
  ],
  templateUrl: './second-community-form-card.component.html',
  styleUrl: './second-community-form-card.component.css'
})
export class SecondCommunityFormCardComponent {

}
