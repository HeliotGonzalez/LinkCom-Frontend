import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ApiService } from './services/api-service.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet], // Add RegisterScreenComponent to imports
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'LinkCom-FrontEnd';
  data: any;
  fontSize: any;
  email: string = ''; // Added email property

  constructor(private apiService: ApiService, private http: HttpClient, private router: Router) {}

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

  // Added email submission method
  onSubmit() {
    const apiUrl = 'http://localhost:3000/add-email'; // Updated to your local backend API endpoint
    const payload = { email: this.email };

    this.http.post(apiUrl, payload).subscribe(
      (response) => {
        console.log('Email submitted successfully:', response);
        alert('Email submitted successfully!');
      },
      (error) => {
        console.error('Error submitting email:', error);
        alert('Failed to submit email.');
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/register']); // Navigate to the register route
  }
}
