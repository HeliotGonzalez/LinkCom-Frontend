import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api-service.service';
import { Community } from '../interfaces/community';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-community-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './community-edit.component.html',
  styleUrls: ['./community-edit.component.css']
})
export class CommunityEditComponent implements OnInit {
  communityForm!: FormGroup;
  communityID!: string; 
  currentCommunity!: Community;
  fileToUpload: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.communityID = params['communityID'];
      this.initializeForm();
      this.loadCommunityData();
    });
  }

  initializeForm() {
    this.communityForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isPrivate: [false]
    });
  }

  loadCommunityData() {
    this.apiService.getCommunity(this.communityID).subscribe({
      next: (res: any) => {
        const data = res.data[0] as Community;
        if (data) {
          this.communityForm.patchValue({
            name: data.name,
            description: data.description,
            isPrivate: data.isPrivate
          });
        }
      },
      error: err => console.error('Error al cargar la comunidad', err)
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.fileToUpload = input.files[0];
    }
  }

  onSubmit() {
    if (this.communityForm.valid) {
      const formValue = this.communityForm.value;
      // Usamos FormData para enviar datos y archivo
      const formData = new FormData();
      let name = formValue.name;
      let description = formValue.description;
      let isPrivate = formValue.isPrivate;
      if (this.fileToUpload) {
        // El campo debe llamarse "image" para coincidir con upload.single("image")
        formData.append("image", this.fileToUpload, this.fileToUpload.name);
      }
      // Llamamos al método del ApiService para actualizar la comunidad
      this.apiService.updateCommunity(this.communityID, {name, description, isPrivate}).subscribe({
        next: res => {
            Swal.fire({
              icon: 'success',
              title: 'Comunidad actualizada',
              text: 'La comunidad se actualizó con éxito.',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.router.navigate(['/community'], { queryParams: { communityID: this.communityID } });
            });
          },
          error: err => {
            console.error("Error al actualizar la comunidad", err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al actualizar la comunidad.',
              confirmButtonText: 'Aceptar'
            });
        }
      });
    } else {
      alert("Formulario no válido");
    }
  }
}
