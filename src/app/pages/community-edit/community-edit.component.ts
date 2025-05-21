import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service.service';
import { Community } from '../../interfaces/community';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { LanguageService } from '../../language.service';

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
  path: string | null = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private location: Location,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    const state = window.history.state as { community?: Community };
    if (state.community) {
      this.community = state.community;
      this.path = this.community.imagePath || '';
      console.log('Path: ', this.path);
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
      this.path = reader.result as string;
      console.log('Base64: ', this.imageBase64);
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
        if (this.languageService.current == 'en'){
          Swal.fire({
            icon: 'success',
            title: 'Community updated',
            text: 'The community has been updated successfully.',
            confirmButtonText: 'Continue'
            }).then(() => {
              this.location.back();
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Comunidad actualizada',
            text: 'La comunidad ha sido actualizada con éxito.',
            confirmButtonText: 'Continuar'
            }).then(() => {
              this.location.back();
          });
        }

      }, 
      error: (error: any) => {
        console.error('Error al actualizar la comunidad', error);
        if (this.languageService.current == 'en'){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error has occurred while updating the community.',
            confirmButtonText: 'Accept'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Sucedió un error al actualizar la comunidad',
            confirmButtonText: 'Accept'
          });
        }

      }
    });
  }
  
}
