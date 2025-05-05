import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { Community } from '../../interfaces/community';
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
  community!: Community;
  fileToUpload: File | null = null;
<<<<<<< HEAD:src/app/community-edit/community-edit.component.ts
=======
  imageBase64!: string | null;
  path: string | null = '';
>>>>>>> 39ac1de (fix: multiple fixes for homepage, community edition, profile and landing):src/app/pages/community-edit/community-edit.component.ts

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
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
<<<<<<< HEAD:src/app/community-edit/community-edit.component.ts
    if (input.files && input.files.length) {
      this.fileToUpload = input.files[0];
    }
  }

  onSubmit() {
    if (this.communityForm.valid) {
      const formValue = this.communityForm.value;
      const formData = new FormData();

      let name = formValue.name;
      let description = formValue.description;
      let isPrivate = formValue.isPrivate;
      
      if (this.fileToUpload) {
        formData.append("image", this.fileToUpload, this.fileToUpload.name);
      }
      
      this.apiService.updateCommunity(this.community.id, {name, description, isPrivate}).subscribe({
        next: res => {
            Swal.fire({
              icon: 'success',
              title: 'Community updated',
              text: 'Was updated successfully',
              confirmButtonText: 'Continue'
            }).then(() => {
              this.router.navigate(['/community'], { queryParams: { communityID: this.community.id } });
            });
          },
          error: err => {
            console.error("Error al actualizar la comunidad", err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error ocurred while updating the community.',
              confirmButtonText: 'Aceptar'
            });
        }
      });
    } else {
      alert("Formulario no válido");
    }
=======
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
        Swal.fire({
          icon: 'success',
          title: 'Community updated',
          text: 'The community has been updated successfully.',
          confirmButtonText: 'Continue'
          }).then(() => {
            this.location.back();
        });
      }, 
      error: (error: any) => {
        console.error('Error al actualizar la comunidad', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error has occurred while updating the community.',
          confirmButtonText: 'Accept'
        });
      }
    });
>>>>>>> 39ac1de (fix: multiple fixes for homepage, community edition, profile and landing):src/app/pages/community-edit/community-edit.component.ts
  }
}
