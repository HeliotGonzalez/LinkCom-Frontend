import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api-service.service';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LinkCom-FrontEnd';

  public showAlert(): void {
    Swal.fire({
      title: '¡Alerta!',
      text: 'Esto es una prueba de SweetAlert2 en Angular',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }
}
