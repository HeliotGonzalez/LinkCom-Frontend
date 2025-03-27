import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-login',
  imports: [
    FormsModule // Asegúrate de agregar FormsModule aquí
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Lógica para procesar el login
    if (this.username && this.password) {
      // Aquí puedes validar los datos de login o hacer una llamada a la API
      console.log('Login successful');
      this.router.navigate(['/dashboard']);
    } else {
      console.log('Please enter username and password');
    }
  }

  cancelLogin() {
    // Redirigir al usuario o limpiar el formulario si cancela
    this.username = '';
    this.password = '';
  }
}
