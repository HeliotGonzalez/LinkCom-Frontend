import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service.service'; 
import { AuthService } from '../../services/auth.service'; 
import { Announce } from '../../interfaces/announce';
import Swal from 'sweetalert2';
import { ServiceFactory } from '../../services/api-services/ServiceFactory.service';
import { CommunityService } from '../../../architecture/services/CommunityService';

@Component({
  selector: 'app-announcement-card',
  templateUrl: './announcement-card.component.html',
  styleUrls: ['./announcement-card.component.css'],
})
export class AnnouncementCardComponent implements OnInit {
  
  @Input() announce!: Announce;
  @Input() imgPath!: string;
  userId!: string;  

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private apiService: ApiService,
    private serviceFactory: ServiceFactory
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserUUID(); 
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
        (this.serviceFactory.get('communities') as CommunityService).removeAnnouncement(announcementId).subscribe({
          next: (response) => {
            console.log('Evento eliminado con éxito:', response);
            Swal.fire({
              title: 'Eliminado!',
              text: 'El evento ha sido eliminado correctamente.',
              icon: 'success',              
            }).then(() => {
              window.location.reload(); 
            })
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
