import {Component, Input} from '@angular/core';
import {FormStepsComponent} from '../../../../form-steps/form-steps.component';
import {Router} from '@angular/router';
import {FormService} from "../../../../services/form-service/form.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-second-community-form',
  imports: [
    FormStepsComponent,
    FormsModule
  ],
  templateUrl: './second-community-form.component.html',
  standalone: true,
  styleUrl: './second-community-form.component.css'
})
export class SecondCommunityFormComponent {
  protected description: string = "";
  protected privateCommunity: boolean = false;

  constructor(private router: Router, private  communityFormService: FormService) {
  }

  previousPage() {
    this.router.navigate(["/firstStepCommunityCreation"]).then(r => {});
    this.saveFormData();
  }

  nextPage(event: Event) {
    event.preventDefault()
    this.router.navigate(["/thirdStepCommunityCreation"]).then(r => {});
    this.saveFormData();
  }

  ngOnInit() {
    this.communityFormService.data$.subscribe(data => {
      this.description = data["communityDescription"];
      this.privateCommunity = data["communityPrivacy"] ? data["communityPrivacy"] : false;
    });
  }

  protected saveFormData() {
    this.communityFormService.put("communityDescription", this.description);
    this.communityFormService.put("communityPrivacy", this.privateCommunity);
    this.communityFormService.update();
  }
}
