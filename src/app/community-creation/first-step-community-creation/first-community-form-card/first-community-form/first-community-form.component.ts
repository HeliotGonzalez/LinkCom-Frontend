import { Component } from '@angular/core';
import {FormStepsComponent} from '../../../form-steps/form-steps.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-first-community-form',
  imports: [
    FormStepsComponent
  ],
  templateUrl: './first-community-form.component.html',
  standalone: true,
  styleUrl: './first-community-form.component.css'
})
export class FirstCommunityFormComponent {

  constructor(private router: Router) {
  }

  nextPage() {
    this.router.navigate(["/secondStepCommunityCreation"]).then(r => {});
  }
}
