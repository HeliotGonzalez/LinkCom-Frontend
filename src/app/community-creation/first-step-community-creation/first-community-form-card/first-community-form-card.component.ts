import { Component } from '@angular/core';
import {FirstCommunityFormComponent} from './first-community-form/first-community-form.component';

@Component({
  selector: 'app-first-community-form-card',
  imports: [
    FirstCommunityFormComponent
  ],
  standalone: true,
  templateUrl: './first-community-form-card.component.html',
  styleUrl: './first-community-form-card.component.css'
})
export class FirstCommunityFormCardComponent {
}
