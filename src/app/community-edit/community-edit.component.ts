import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api-service.service';
import { Community } from '../interfaces/community';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

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
  community!: Community;
  fileToUpload: File | null = null;
  imageBase64!: string | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private location: Location
  ) {}

  ngOnInit() {
    const state = window.history.state as { community?: Community };
    if (state.community) {
      this.community = state.community;
      console.log('Comunidad: ', this.community);
      this.buildFormFrom(this.community);
    }
  }

  private buildFormFrom(c: Community) {
    this.communityForm = this.fb.group({
      name:        [c.name,        Validators.required],
      description: [c.description],
      isPrivate:   [c.isPrivate]
    });
  }

  loadCommunityData() {
    this.apiService.getCommunity(this.community.id).subscribe({
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
    if (!input.files?.length) return;
    this.fileToUpload = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
    };
    reader.readAsDataURL(this.fileToUpload);
  }
  
  onSubmit() {
    if (!this.communityForm.valid) return alert("Formulario no válido");
  
    const { name, description, isPrivate } = this.communityForm.value;
    const payload: any = { name, description, isPrivate };
  
    if (this.imageBase64) {
      payload.imageBase64 = this.imageBase64;
    }
  
    this.apiService.updateCommunity(this.community.id, payload).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Comunidad actualizada',
          text: 'La comunidad ha sido actualizada exitosamente.',
          confirmButtonText: 'Aceptar'
          }).then(() => {
            this.location.back();
        });
      }, 
      error: (error: any) => {
        console.error('Error al actualizar la comunidad', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la comunidad. Por favor, inténtelo de nuevo más tarde.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  
}
