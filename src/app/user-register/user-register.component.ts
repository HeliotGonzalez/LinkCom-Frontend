import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api-service.service';
import Swal from 'sweetalert2';
import { HeaderVisibilityService } from '../services/header-visibility.service';

@Component({
  selector: 'app-user-register',
  imports: [
    FormsModule,
  ],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
  standalone: true,
})
export class UserRegisterComponent {
  protected username: string = '';
  protected email: string = '';
  protected password: string = '';
  protected description: string = '';
  protected confirmPassword: string = '';

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService, private headerService: HeaderVisibilityService) {}

  onSubmit(): void {
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
          confirmButtonText: 'Go to login',
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
        this.router.navigate(['/login']);
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
    this.headerService.hide();
  }

  ngOnDestroy() {
    this.headerService.show();
  }
}
