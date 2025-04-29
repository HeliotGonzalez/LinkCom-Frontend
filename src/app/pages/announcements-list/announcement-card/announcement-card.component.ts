import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service.service'; // Asegúrate de tener ApiService
import { AuthService } from '../../services/auth.service'; // Asegúrate de tener AuthService
import { Announce } from '../../interfaces/announce';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
import { ServiceFactory } from '../../services/api-services/ServiceFactory.service';
import { CommunityService } from '../../../architecture/services/CommunityService';

@Component({
  selector: 'app-announcement-card',
  templateUrl: './announcement-card.component.html',
  styleUrls: ['./announcement-card.component.css'],
  imports: [NgIf], // Si usas Angular 14 o superior, puedes usar standalone components
})
export class AnnouncementCardComponent implements OnInit {
  
  @Input() announce!: Announce;
  @Input() imgPath!: string;
  userId!: string;  // Variable para almacenar el userId del usuario autenticado

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private apiService: ApiService,
    private serviceFactory: ServiceFactory
  ) {}

  ngOnInit() {
    // Obtener el userId del servicio de autenticación
    this.userId = this.authService.getUserUUID(); // Asegúrate de que este método exista en AuthService
    console.log('User ID:', this.userId); // Verifica que el userId se obtenga correctamente
    console.log('Anuncio Publisher ID:', this.announce.publisherID);
  }

  // Método para eliminar el anuncio
  deleteAnnouncement(announcementId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Este anuncio será eliminado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('ID del anuncio a eliminar:', announcementId);
        // Hacer la llamada al API de eliminación
        (this.serviceFactory.get('communities') as CommunityService).removeAnnouncement(announcementId).subscribe({
          next: (response) => {
            console.log('Evento eliminado con éxito:', response);
            Swal.fire({
              title: 'Eliminado!',
              text: 'El evento ha sido eliminado correctamente.',
              icon: 'success',
            });
            // Aquí puedes agregar lógica para actualizar la vista o redirigir
            // Por ejemplo, redirigir al usuario a la página de anuncios:
            this.router.navigate(['/announcements']);
          },
          error: (error) => {
            console.error('Error al eliminar el evento:', error);
            Swal.fire({
              title: 'Error!',
              text: 'No se pudo eliminar el evento. Inténtalo de nuevo.',
              icon: 'error',
              confirmButtonText: 'Reintentar',
            });
          }
        });
      }
    });
  }
}
