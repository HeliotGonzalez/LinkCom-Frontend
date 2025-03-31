import {Component} from '@angular/core';
import {FormStepsComponent} from '../../../../form-steps/form-steps.component';
import {Router} from "@angular/router";
import {FormService} from '../../../../services/form-service/form.service';
import {Form, FormsModule} from '@angular/forms';
import Swal from "sweetalert2";

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

  constructor(private router: Router, private formService: FormService) {
  }

  nextPage(event: Event) {
    event.preventDefault();
    if (this.eventName === "" || this.eventName === "" || this.eventLocation === "" || this.eventLocation === "") {
      Swal.fire("Error!", "All required fields must be filled!", "error");
      return;
    }
    this.router.navigate(["/secondStepEventCreation"]).then(r => {});
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
