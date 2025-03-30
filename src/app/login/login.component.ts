import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
})
export class LoginComponent {
  protected email: string = '';
  protected password: string = '';

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter email and password.',
        icon: 'error',
        confirmButtonText: 'Retry',
        backdrop: false,
        customClass: { popup: 'custom-swal-popup' },
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

    const payload = { email: this.email, password: this.password };

    console.log('Payload enviado:', payload);

    const apiUrl = 'http://localhost:3000/login';
    this.http.post(apiUrl, payload).subscribe(
      (response: any) => {
        console.log('User logged in successfully:', response);
        localStorage.setItem('token', response.token);

        Swal.fire({
          title: 'Success!',
          text: 'User Logged In successfully.',
          icon: 'success',
          confirmButtonText: 'Continue',
          backdrop: false,
          customClass: { popup: 'custom-swal-popup' },
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

        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Error during login:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Invalid email or password. Please try again.',
          icon: 'error',
          confirmButtonText: 'Retry',
          backdrop: false,
          customClass: { popup: 'custom-swal-popup' },
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

  setFocus(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    input.focus();
  }

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: (response: any) => {
        console.log('Respuesta recibida:', response);
      },
      error: (error: any) => {
        console.log('Error recibido:', error);
      }
    });
  }
}
