import {Component, Input} from '@angular/core';
import {FormStepsComponent} from '../../../../form-steps/form-steps.component';
import {Router} from '@angular/router';
import {FormService} from "../../../../services/form-service/form.service";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";

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
    protected formData: FormService | null = null;
    protected description: string = "";
    protected privateCommunity: boolean = false;

    constructor(private router: Router, private formService: FormService) {
    }

    previousPage() {
        this.router.navigate(["/firstStepCommunityCreation"]).then(r => {
        });
        this.saveFormData();
    }

    nextPage(event: Event) {
        event.preventDefault()
        if (this.description === "") {
            Swal.fire("Error!", "All required fields must be filled!", "error");
            return;
        }
        this.router.navigate(["/thirdStepCommunityCreation"]).then(r => {
        });
        this.saveFormData();
    }

    ngOnInit() {
        this.formData = this.formService.get("community") as FormService;
        console.log(this.formData)
        this.description = this.formData.getOrDefault("description", "");
        this.privateCommunity = this.formData.getOrDefault("privacy", false);
    }

    protected saveFormData() {
        this.formData!.put("description", this.description);
        this.formData!.put("privacy", this.privateCommunity);
        this.formService.update();
    }
}
