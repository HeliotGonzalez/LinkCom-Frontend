
import { Component } from '@angular/core';
import { Router } from '@angular/router';
<<<<<<< HEAD
<<<<<<< HEAD
import { InterestTagComponent } from "../../interest-tag/interest-tag.component";
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-third-step',
  imports: [InterestTagComponent, FormsModule],
=======
import {FormStepsComponent} from "../../../components/form-steps/form-steps.component";

@Component({
  selector: 'app-register-third-step',
  imports: [
    FormStepsComponent
  ],
>>>>>>> 393b45d (refactor: user registration steps and events views refactored.)
=======
import { InterestTagComponent } from "../../../components/interest-tag/interest-tag.component";
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-third-step',
  imports: [InterestTagComponent, FormsModule],
>>>>>>> a31d632 (feat: added interest to register)
  templateUrl: './register-third-step.component.html',
  styleUrl: './register-third-step.component.css'
})
export class RegisterThirdStepComponent {

  protected newTag: string = "";
  protected interests: string[] = [];
  protected storedInterests: string[] = [];
  protected interestsCoincidences: string[] = [];

  constructor(private router: Router) {}

  goToSecondStep() {
    this.router.navigate(['/user-register/secondStep']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  ngOnInit() {
    // Simulate fetching interests from an API
    this.storedInterests = ["sports", "music", "art", "technology", "travel"];
  }

  addInterestTag(event: Event, value: string) {
        event.preventDefault();
        if (!this.storedInterests.includes(value)) {
            Swal.fire("Error!", "Interest not found!", "error");
            return;
        }
        let normalizedValue = `#${value}`.toLowerCase();
        if (!(this.interests.includes(normalizedValue))) this.interests = [...this.interests, normalizedValue];
        this.newTag = "";
    }

    removeInterest(interestName: string) {
        this.interests = this.interests.filter(i => i !== interestName);
    }

    getCoincidences(event: Event, value: string) {
        this.interestsCoincidences = this.storedInterests.filter(i => value !== '' && i.startsWith(value)).filter(i => !this.interests.includes(`#${i}`.toLowerCase()));
    }
    addInterestTagFromCoincidence($event: MouseEvent, interest: string) {
      this.interestsCoincidences = this.interestsCoincidences.filter(i => i !== interest);
      this.addInterestTag($event, interest);
  }
}
