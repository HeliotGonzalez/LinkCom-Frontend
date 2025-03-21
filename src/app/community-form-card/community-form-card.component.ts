import { Component } from '@angular/core';
import {FormStepsComponent} from '../form-steps/form-steps.component';

@Component({
  selector: 'app-community-form-card',
  imports: [
    FormStepsComponent
  ],
  standalone: true,
  templateUrl: './community-form-card.component.html',
  styleUrl: './community-form-card.component.css'
})
export class CommunityFormCardComponent {

}
