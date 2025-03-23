import {Component, Input} from '@angular/core';
import {FormStepsComponent} from "../../../form-steps/form-steps.component";
import {Router} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-third-community-form',
  imports: [
    FormStepsComponent,
    NgIf
  ],
  templateUrl: './third-community-form.component.html',
  styleUrl: './third-community-form.component.css'
})
export class ThirdCommunityFormComponent {
  uploadedImage: string | null = null;

  constructor(private router: Router) {
  }

  previousPage() {
    this.router.navigate(["/secondStepCommunityCreation"]).then(r => {});
  }

  nextPage() {
    this.router.navigate(["/"]).then(r => {});
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
