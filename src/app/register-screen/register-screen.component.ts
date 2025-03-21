import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-screen',
  standalone: true,
  imports: [FormsModule, HttpClientModule], // Import FormsModule and HttpClientModule here
  templateUrl: './register-screen.component.html',
  styleUrls: ['./register-screen.component.css'],
})
export class RegisterScreenComponent {
  formData = {
    username: '',
    email: '',
    password: '',
  };

  profileImage: File | null = null;
  imagePreview: string | null = null;

  constructor(private http: HttpClient) {}

  // Handle file selection and generate preview
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileImage = input.files[0];

      // Generate a preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.profileImage);

      console.log('Selected file:', this.profileImage);
    }
  }

  // Handle form submission
  onSubmit(): void {
    const apiUrl = 'http://localhost:3000/register'; // Update to your backend API endpoint
    const payload = {
      username: this.formData.username,
      email: this.formData.email,
      password: this.formData.password,
    };

    // Send the data to the backend
    this.http.post(apiUrl, payload).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        alert('Registration successful!');
      },
      (error) => {
        console.error('Error during registration:', error);
        alert('Failed to register. Please try again.');
      }
    );
  }
}
