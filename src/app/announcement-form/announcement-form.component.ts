import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement-form',
  imports: [],
  templateUrl: './announcement-form.component.html',
  styleUrl: './announcement-form.component.css'
})
export class AnnouncementFormComponent {
  title: string = '';
  description: string = '';
  imageUrl: string = '';
  link: string = '';
  tags: string[] = [];
  submitted = false;


  //TO-DO: función de adición y substracción de etiquetas


  onSubmit(title:HTMLInputElement, description: HTMLTextAreaElement) {

    this.title = title.value;
    this.description = description.value;

    this.submitted = true;
    console.log(this.title, this.description);
    if (this.title && this.description.length >= 10) {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Anuncio publicado',
        confirmButtonText: 'OK' 
      })
      this.resetForm();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en la publicación',
        text: 'Oh! Parece que quedan campos por rellenar',
        confirmButtonText: 'Ok' 
      })
    }
  }


  //TO-DO: barra de etiquetas dinámicas

  resetForm() {
    this.title = '';
    this.description = '';
    this.imageUrl = '';
    this.link = '';
    this.submitted = false;
  }
}
