import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importación de FormsModule
import { Router } from '@angular/router';  // Importación de Router si quieres navegar entre rutas

@Component({
  selector: 'app-user-register',
  imports: [
    FormsModule,  // Importa FormsModule aquí
  ],
  templateUrl: './user-register.component.html',  // Asegúrate de tener el archivo HTML adecuado
  styleUrls: ['./user-register.component.css'],  // Asegúrate de tener el archivo CSS adecuado
  standalone: true  // Establece el componente como autónomo
})
export class UserRegisterComponent {
  // Define los campos del formulario de registro
  protected username: string = '';
  protected email: string = '';
  protected password: string = '';
  protected confirmPassword: string = '';

  // Constructor para inyectar el servicio de Router
  constructor(private router: Router) {}

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Lógica para registrar al usuario (puedes conectarlo con tu servicio backend)
    console.log('User Registered:', { username: this.username, email: this.email });
    this.router.navigate(['/welcome']);  // Redirige a una página de bienvenida o cualquier otra ruta
  }

  // Método para cancelar el registro
  cancelRegister(): void {
    // Lógica para cancelar el registro
    console.log('Registration canceled');
    this.router.navigate(['/']);  // Redirige al usuario a la página principal o cualquier otra página
  }

  // Método para establecer el foco en un campo de entrada específico
  setFocus(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    input.focus();
  }
}
