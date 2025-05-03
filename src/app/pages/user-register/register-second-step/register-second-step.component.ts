import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormStepsComponent} from "../../../components/form-steps/form-steps.component";

@Component({
    selector: 'app-register-second-step',
    templateUrl: './register-second-step.component.html',
    imports: [
        FormStepsComponent
    ],
    styleUrls: ['./register-second-step.component.css']
})
export class RegisterSecondStepComponent implements OnInit {

  imagePreview: string | null = null; // Variable para almacenar la vista previa de la imagen
  imageFile: File | null = null; // Archivo de la imagen seleccionada
  protected image: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Cargar la imagen desde localStorage si existe
    const savedImage = localStorage.getItem('imagePreview');
    if (savedImage) {
      this.imagePreview = savedImage; // Asigna la imagen guardada en localStorage
    }
  }

  // Método para manejar la imagen seleccionada
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string; // Asigna la imagen al src para la vista previa
        this.imageFile = file; // Guarda el archivo para la subida
        localStorage.setItem('imagePreview', this.imagePreview); // Guardamos la URL de la imagen en localStorage
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para eliminar la imagen
  onRemoveImage(): void {
    this.imagePreview = null; // Elimina la vista previa
    localStorage.removeItem('imagePreview'); // Elimina la URL de localStorage
    this.image = "";
  }

  goToThirdStep() {
    this.router.navigate(['/user-register/thirdStep']);
  }

  goToFirstStep() {
    this.router.navigate(['/user-register/firstStep']);
  }

  protected setImageValue(value: string) {
    this.image = value;
  }

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  protected handleFile(file: File) {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.setImageValue(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  }

  protected triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  protected onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }
}
