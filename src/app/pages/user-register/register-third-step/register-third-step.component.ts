import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormStepsComponent} from "../../../components/form-steps/form-steps.component";

@Component({
  selector: 'app-register-third-step',
  imports: [
    FormStepsComponent
  ],
  templateUrl: './register-third-step.component.html',
  styleUrl: './register-third-step.component.css'
})
export class RegisterThirdStepComponent {

  constructor(private router: Router) {}

  goToSecondStep() {
    this.router.navigate(['/user-register/secondStep']);
  }
}
