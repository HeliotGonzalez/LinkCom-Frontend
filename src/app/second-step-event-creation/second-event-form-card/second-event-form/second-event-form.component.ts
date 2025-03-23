import { Component } from '@angular/core';
import {FormStepsComponent} from "../../../community-creation/form-steps/form-steps.component";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-second-event-form',
  imports: [
    FormStepsComponent,
    NgIf
  ],
  templateUrl: './second-event-form.component.html',
  styleUrl: './second-event-form.component.css'
})
export class SecondEventFormComponent {
  uploadedImage: string | null = null;

  constructor(private router: Router) {
  }

  previousPage() {
    this.router.navigate(["/firstStepEventCreation"]).then(r => {});
  }

  nextPage() {
    this.router.navigate(["/firstStepEventCreation"]).then(r => {});
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
}
