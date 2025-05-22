import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api-service.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import {FormStepsComponent} from "../../../components/form-steps/form-steps.component";
import { FormService } from '../../../services/form-service/form.service';

@Component({
  selector: 'app-register-first-step',
    imports: [
        FormsModule,
        CommonModule,
        FormStepsComponent
    ],
  templateUrl: './register-first-step.component.html',
  styleUrls: ['./register-first-step.component.css'],
  standalone: true,
})

export class RegisterFirstStepComponent {
  protected usernameTaken: boolean = false;
  protected emailTaken: boolean = false;
  protected passwordLengthError: boolean = false;
  protected confPasswordLengthError: boolean = false;
  protected passwordsMatch: boolean = false;

  protected username: string = '' ;
  protected email: string = '';
  protected password: string = '';
  protected description: string = '';
  protected confirmPassword: string = '';
  protected imagePath: string = '';
  protected userData!: FormService;

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService, private formData: FormService) {}

  ngOnInit() {
    this.formData.createFormEntry('userRegister');
    this.userData = this.formData.get('userRegister');
  }

  goToSecondStep() {
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry',
        backdrop: false, // Evita que SweetAlert2 cambie el <body>
        customClass: {
          popup: 'custom-swal-popup' // Añade una clase personalizada
        },
        didOpen: () => {
          document.body.insertAdjacentHTML(
            'beforeend',
            '<div id="blur-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);backdrop-filter:blur(10px);z-index:2;"></div>'
          );
        },
        didClose: () => {
          const blurOverlay = document.getElementById('blur-overlay');
          if (blurOverlay) blurOverlay.remove();
        }
      });
      return;
    }

    this.userData.put('payload',{
      username: this.username,
      email: this.email,
      password: this.password,
      description: this.description,
      imagePath: this.imagePath
      })

    this.router.navigate(['/user-register/secondStep']);
  }
  
  // Method to set focus on a specific input field
  setFocus(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    input.focus();
  }

  checkUsername(username: string) {
    const url = `http://localhost:3000/user-register/firstStep?username=${encodeURIComponent(username)}`;
  
    this.http.get(url).subscribe({
      next: (response: any) => {
        if (response.usernameExists) {
          this.usernameTaken = true;
          console.log('Username is taken:', this.usernameTaken);
        } else {
          this.usernameTaken = false;
        }
      },
      error: (err) => {
        console.error('Error al verificar username:', err);
        // Podés decidir qué hacer aquí: dejar el usernameTaken como false o mostrar un mensaje de error
      }
    });
  }
  
  checkEmail(email: string) {
    const url = `http://localhost:3000/user-register/firstStep?email=${encodeURIComponent(email)}`;
  
    this.http.get(url).subscribe({
      next: (response: any) => {
        if (response.emailExists) { // Cambié 'exists' por 'emailExists'
          this.emailTaken = true;
          console.log('Email is taken:', this.emailTaken);
        } else {
          this.emailTaken = false;
        }
      },
      error: (err) => {
        console.error('Error al verificar email:', err);
      }
    });
  }

  checkPassLength(password: string) {
    if (password.length < 6) {
      this.passwordLengthError = true;
    } else {
      this.passwordLengthError = false;
    }
  }

  checkConfPassLength(password: string) {
    if (password.length < 6) {
      this.confPasswordLengthError = true;
    } else {
      this.confPasswordLengthError = false;
    }
  }
  
}
