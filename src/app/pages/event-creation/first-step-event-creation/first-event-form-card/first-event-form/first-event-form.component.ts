import {Component} from '@angular/core';
import {FormStepsComponent} from '../../../../../components/form-steps/form-steps.component';
import {ActivatedRoute, Router} from "@angular/router";
import {FormService} from '../../../../../services/form-service/form.service';
import {FormsModule} from '@angular/forms';
import Swal from "sweetalert2";
import { LanguageService } from '../../../../../language.service';

@Component({
    selector: 'app-first-event-form',
    imports: [
        FormStepsComponent,
        FormsModule
    ],
    templateUrl: './first-event-form.component.html',
    standalone: true,
    styleUrl: './first-event-form.component.css'
})
export class FirstEventFormComponent {

    protected formData: FormService | null = null;
    protected eventName: string | null = "";
    protected eventDate: string | null = "";
    protected eventTime: string | null = "";
    protected eventLocation: string | null = "";

    constructor(private router: Router, private route: ActivatedRoute, private formService: FormService, private languageService: LanguageService) {
    }

    cancelForm(event: Event) {
        event.preventDefault();
        this.router.navigate(['community', this.formData?.get('communityID')]).then(r => {});
    }

    nextPage(event: Event) {
        event.preventDefault();
        if (this.eventName === "" || this.eventName === "" || this.eventLocation === "" || this.eventLocation === "") {
            if (this.languageService.current == 'en'){
                Swal.fire("Error!", "All required fields must be filled!", "error");
            } else {
                Swal.fire("¡Error!", "Todos los campos requeridos deben ser introducidos.", "error");
            }
            return;
        }
        this.router.navigate(["/secondStepEventCreation"]).then(r => {
        });
        this.saveFormData();
    }

    protected saveFormData() {
        this.formData!.put("name", this.eventName);
        this.formData!.put("date", this.eventDate);
        this.formData!.put("time", this.eventTime);
        this.formData!.put("location", this.eventLocation);
        this.formService.update();
    }

    ngOnInit() {
        this.formData = this.formService.createFormEntry("event") as FormService;
        this.route.queryParams.subscribe(params => {
            this.formData?.put('communityID', params['communityID']);
        })
        this.eventName = this.formData.getOrDefault("name", "");
        this.eventDate = this.formData.getOrDefault("date", "");
        this.eventTime = this.formData.getOrDefault("time", "");
        this.eventLocation = this.formData.getOrDefault("location", "");
    }

    setFocus(event: Event, input: HTMLInputElement) {
        event.preventDefault();
        input.focus();
    }
}
