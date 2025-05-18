import {Component, Input} from '@angular/core';
import {FormStepsComponent} from '../../../../../components/form-steps/form-steps.component';
import {Router} from '@angular/router';
import {FormService} from "../../../../../services/form-service/form.service";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import { LanguageService } from '../../../../../language.service';

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

    constructor(private router: Router, private formService: FormService, private languageService: LanguageService) {
    }

    previousPage() {
        this.router.navigate(["/firstStepCommunityCreation"]).then(r => {
        });
        this.saveFormData();
    }

    nextPage(event: Event) {
        event.preventDefault()
        if (this.description === "") {
            if (this.languageService.current == 'en'){
                Swal.fire("Error!", "All required fields must be filled!", "error");
            } else {
                Swal.fire("¡Error!", "Todos los campos requeridos deben ser introducidos", "error");
            }
            return;
        }
        this.router.navigate(["/thirdStepCommunityCreation"]).then(r => {
        });
        this.saveFormData();
    }

    ngOnInit() {
        this.formData = this.formService.get("community") as FormService;
        this.description = this.formData.getOrDefault("description", "");
        this.privateCommunity = this.formData.getOrDefault("privacy", false);
    }

    protected saveFormData() {
        this.formData!.put("description", this.description);
        this.formData!.put("privacy", this.privateCommunity);
        this.formService.update();
    }

    changeFormStep(route: string) {
        this.saveFormData();
        if (this.description === "") {
            if (this.languageService.current == 'en'){
                Swal.fire("Error!", "All required fields must be filled!", "error");
            } else {
                Swal.fire("¡Error!", "Todos los campos requeridos deben ser introducidos", "error");
            }
            return;
        }
    }
}
