import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-first-step',
  imports: [
    FormsModule,
  ],
  templateUrl: './register-first-step.component.html',
  styleUrls: ['./register-first-step.component.css'],
  standalone: true,
})
export class RegisterFirstStepComponent {
  protected username: string = '';
  protected email: string = '';
  protected password: string = '';
  protected confirmPassword: string = '';

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {}


  goToSecondStep() {
    this.router.navigate(['/user-register/secondStep']);
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
}
