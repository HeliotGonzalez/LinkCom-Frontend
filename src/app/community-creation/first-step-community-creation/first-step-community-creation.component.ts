import {Component, Input} from '@angular/core';
import {FirstCommunityFormCardComponent} from "./first-community-form-card/first-community-form-card.component";

@Component({
  selector: 'app-first-step-community-creation',
    imports: [
        FirstCommunityFormCardComponent
    ],
  templateUrl: './first-step-community-creation.component.html',
  styleUrl: './first-step-community-creation.component.css'
})
export class FirstStepCommunityCreationComponent {
  @Input() firstStepClass: string = "focused-step";
  @Input() secondStepClass: string = "";
  @Input() thirdStepClass: string = "";
}
