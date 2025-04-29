import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-first-step',
  imports: [
    FormsModule,
    CommonModule
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

  protected username: string = '';
  protected email: string = '';
  protected password: string = '';
  protected description: string = '';
  protected confirmPassword: string = '';

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {}


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

    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      description: this.description,
    };
    
    console.log('Payload enviado:', payload); // <-- Agregado para depuración
  
    const apiUrl = 'http://localhost:3000/user-register';
    this.http.post(apiUrl, payload).subscribe(
      (response) => {
        console.log('User registered successfully:', response);
        Swal.fire({
          title: 'Success!',
          text: 'User registered successfully.',
          icon: 'success',
          confirmButtonText: 'Continue',
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
          // Si la respuesta es exitosa, redirige al segundo paso
          this.router.navigate(['/user-register/secondStep']);
      },
      (error) => {
        console.error('Error during registration:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error during registration. Please try again.',
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
      }
    );

  }
  
  // Method to set focus on a specific input field
  setFocus(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    input.focus();
  }

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: (response: any) => {
        console.log('Respuesta recibida:', response);
      },
      error: (erro: any) => {
        console.log('Respuesta recibida:', erro);
      }
    });
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
        // Podés decidir qué hacer aquí: dejar el emailTaken como false o mostrar un mensaje de error
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
