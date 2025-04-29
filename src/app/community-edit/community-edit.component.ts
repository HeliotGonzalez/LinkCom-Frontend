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
  community!: Community;
  fileToUpload: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
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
  }
}
