import {Component, Input} from '@angular/core';
import {FormStepsComponent} from '../../../form-steps/form-steps.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-second-community-form',
  imports: [
    FormStepsComponent
  ],
  templateUrl: './second-community-form.component.html',
  styleUrl: './second-community-form.component.css'
})
export class SecondCommunityFormComponent {

  constructor(private router: Router) {
  }

  previousPage() {
    this.router.navigate(["/firstStepCommunityCreation"]).then(r => {});
  }

  nextPage() {
    this.router.navigate(["/thirdStepCommunityCreation"]).then(r => {});
  }
}
