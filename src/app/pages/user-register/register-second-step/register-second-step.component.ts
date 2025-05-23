import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormStepsComponent} from "../../../components/form-steps/form-steps.component";
import { FormService } from '../../../services/form-service/form.service';

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
  protected userData!: FormService;
  protected ImageForm!: FormService;

  constructor(private router: Router, private formData: FormService) {}

  ngOnInit(): void {
    this.formData.createFormEntry('image');
    this.ImageForm = this.formData.get('imageUpload');

    this.userData = this.formData.get('userRegister');    // Cargar la imagen desde localStorage si existe
    const savedImage = localStorage.getItem('imagePreview');
    if (savedImage) {
      this.imagePreview = savedImage;
      this.image = savedImage;

      this.formData.createFormEntry('imageUpload');
      const imageForm = this.formData.get('imageUpload');
      imageForm.image = savedImage;

      console.log('Imagen cargada desde localStorage en formData:', imageForm.image);
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
      reader.onload = async () => {
        const result = reader.result as string;
        const resized = await this.reduceImageSize(result); // Reduce la imagen

        this.imagePreview = resized;
        this.image = resized;
        this.imageFile = file;

        localStorage.setItem('imagePreview', resized); // Guarda la imagen reducida

        // Actualiza imageUpload
        this.formData.createFormEntry('imageUpload');
        const imageForm = this.formData.get('imageUpload');
        imageForm.image = resized;

        const currentPayload = this.userData.get('payload') || {};
        const updatedPayload = {
          ...currentPayload,
          imagePath: resized
        };
        this.userData.put('payload', updatedPayload);


        console.log('Imagen redimensionada y guardada en formData:', imageForm.image);
        console.log('Payload actualizado con imagePath:', updatedPayload);
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

onImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.handleFile(file);
  }
}

protected onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.handleFile(file);
  }
}

reduceImageSize(base64: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Reducimos al 70%
      const scale = 0.7;
      const width = img.width * scale;
      const height = img.height * scale;

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      // Exportamos a JPEG con calidad 0.7 (también 70%)
      const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      resolve(resizedBase64);
    };
    img.src = base64;
  });
}


}
