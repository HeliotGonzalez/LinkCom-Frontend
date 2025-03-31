import { Component } from '@angular/core';
import {FormStepsComponent} from "../../../../form-steps/form-steps.component";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {FormService} from '../../../../services/form-service/form.service';
import {FormsModule} from '@angular/forms';
import {ApiService} from "../../../../services/api-service.service";
import {firstValueFrom} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: 'app-second-event-form',
  imports: [
    FormStepsComponent,
    NgIf,
    FormsModule
  ],
  templateUrl: './second-event-form.component.html',
  standalone: true,
  styleUrl: './second-event-form.component.css'
})
export class SecondEventFormComponent {
  protected uploadedImage: string | null = null;
  protected eventDescription: string = "";

  constructor(private router: Router, private formService: FormService, private apiService: ApiService) {
  }

  previousPage(event: Event) {
    event.preventDefault();
    this.router.navigate(["/firstStepEventCreation"]).then(r => {});
    this.saveFormData();
  }

  async nextPage(event: Event) {
    event.preventDefault()

    const data = await firstValueFrom(this.formService.data$);

    this.apiService.createEvent(
        data["eventTitle"],
        this.eventDescription,
        "a0c0e447-e231-4b2e-9b12-52b6f556c598",
        "c97cfff8-009d-449e-8718-fdd16e4974a8",
        new Date(`${data["eventDate"]}T${data["eventTime"]}`)
    ).subscribe({
      next: res => Swal.fire({
        title: "Success!",
        text: "Your event has been correctly created!",
        icon: "success",
        confirmButtonText: "Continue"
      }),
      error: err => Swal.fire({
        title: "Error!",
        text: "We could not create your event.",
        icon: "error",
        confirmButtonText: "Continue"
      })
    });

    this.saveFormData();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File) {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, sube solo una imagen.");
    }
  }

  ngOnInit() {
    this.uploadedImage = this.formService.get("eventImage");
    this.eventDescription = this.formService.get("eventDescription");
  }

  protected saveFormData() {
    this.formService.put("eventImage", this.uploadedImage);
    this.formService.put("eventDescription", this.eventDescription);
    this.formService.update();
  }
}
