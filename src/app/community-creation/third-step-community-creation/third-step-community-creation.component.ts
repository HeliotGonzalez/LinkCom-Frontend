import { Component } from '@angular/core';
import {
  SecondCommunityFormCardComponent
} from '../second-step-community-creation/second-community-form-card/second-community-form-card.component';
import {ThirdCommunityFormCardComponent} from './third-community-form-card/third-community-form-card.component';

@Component({
  selector: 'app-third-step-community-creation',
  imports: [
    SecondCommunityFormCardComponent,
    ThirdCommunityFormCardComponent
  ],
  templateUrl: './third-step-community-creation.component.html',
  styleUrl: './third-step-community-creation.component.css'
})
export class ThirdStepCommunityCreationComponent {

}
