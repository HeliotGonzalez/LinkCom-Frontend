import { Component } from '@angular/core';
import {
  SecondCommunityFormComponent
} from '../../second-step-community-creation/second-community-form-card/second-community-form/second-community-form.component';
import {ThirdCommunityFormComponent} from './third-community-form/third-community-form.component';

@Component({
  selector: 'app-third-community-form-card',
  imports: [
    SecondCommunityFormComponent,
    ThirdCommunityFormComponent
  ],
  templateUrl: './third-community-form-card.component.html',
  styleUrl: './third-community-form-card.component.css'
})
export class ThirdCommunityFormCardComponent {

}
