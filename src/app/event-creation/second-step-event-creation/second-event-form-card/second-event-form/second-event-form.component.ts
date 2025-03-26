import { Component } from '@angular/core';
import {FormStepsComponent} from "../../../../community-creation/form-steps/form-steps.component";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {CommunityFormService} from '../../../../services/community-form-service/community-form.service';
import {FormsModule} from '@angular/forms';

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
  protected eventDescription: string | null = "";

  constructor(private router: Router, private formService: CommunityFormService) {
  }

  previousPage() {
    this.router.navigate(["/firstStepEventCreation"]).then(r => {});
    this.saveFormData();
  }

  nextPage() {
    this.router.navigate(["/firstStepEventCreation"]).then(r => {});
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

  private saveFormData() {
    this.formService.put("eventImage", this.uploadedImage);
    this.formService.put("eventDescription", this.eventDescription);
    this.formService.update();
  }
}
