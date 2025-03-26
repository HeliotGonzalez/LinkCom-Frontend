import {Component, Input} from '@angular/core';
import {FormStepsComponent} from '../../../form-steps/form-steps.component';
import {Router} from '@angular/router';
import {CommunityFormService} from "../../../../services/community-form-service/community-form.service";
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

  constructor(private router: Router, private  communityFormService: CommunityFormService) {
  }

  previousPage() {
    this.router.navigate(["/firstStepCommunityCreation"]).then(r => {});
    this.saveData();
  }

  nextPage() {
    this.router.navigate(["/thirdStepCommunityCreation"]).then(r => {});
    this.saveData();
  }

  ngOnInit() {
    this.communityFormService.data$.subscribe(data => {
      this.description = data["description"];
      this.privateCommunity = data["privateCommunity"] ? data["privateCommunity"] : false;
    });
  }

  private saveData() {
    this.communityFormService.put("privateCommunity", this.privateCommunity);
    this.communityFormService.put("description", this.description);
    this.communityFormService.update();
  }
}
