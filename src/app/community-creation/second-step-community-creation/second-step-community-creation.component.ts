import { Component } from '@angular/core';
import {FirstCommunityFormCardComponent} from "../first-step-community-creation/first-community-form-card/first-community-form-card.component";
import {SecondCommunityFormCardComponent} from './second-community-form-card/second-community-form-card.component';

@Component({
  selector: 'app-second-step-community-creation',
  imports: [
    FirstCommunityFormCardComponent,
    SecondCommunityFormCardComponent
  ],
  templateUrl: './second-step-community-creation.component.html',
  styleUrl: './second-step-community-creation.component.css'
})
export class SecondStepCommunityCreationComponent {

}
