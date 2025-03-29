import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api-service.service';
import { FeedItem } from '../interfaces/feed-item';
import { Community } from '../interfaces/community';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  imports: [CommonModule]
})
export class HomepageComponent implements OnInit {
  allFeedItems: FeedItem[] = [];
  displayedFeedItems: FeedItem[] = [];
  feedBatchSize: number = 2;

  communities: Community[] = [];

  // Calendario
  calendarWeeks: (number | null)[][] = [];
  dayNames: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  todayDay: number = 0;
  calendarEvents: { [day: number]: string[] } = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchFeed();
    this.fetchCommunities();
    this.fetchCalendarEvents();

    // Generar el calendario en sí (estructura de celdas)
    this.generateCalendar();
  }

  // Obtener feed del usuario (eventos + noticias)
  fetchFeed(): void {
    // Eventos y noticias
    this.apiService.getFeed('550e8400-e29b-41d4-a716-446655440000').subscribe({
      next: (data: FeedItem[]) => {
        this.allFeedItems = data.map(item => ({
          ...item,
          date: new Date(item.date)
        }));
        this.loadMoreFeed();
      },
      error: (err) => {
        console.error('Error al obtener feed:', err);
      }
    });
    
  }

  // Lazy load: ir cargando en batches de feedBatchSize
  loadMoreFeed(): void {
    const nextItems = this.allFeedItems.slice(
      this.displayedFeedItems.length,
      this.displayedFeedItems.length + this.feedBatchSize
    );
    this.displayedFeedItems = this.displayedFeedItems.concat(nextItems);
  }

  // Obtener comunidades del backend, aquellas a las que el usuario NO pertenece
  fetchCommunities(): void {
    this.apiService.getCommunities('550e8400-e29b-41d4-a716-446655440000').subscribe({
      next: (data: Community[]) => {
        this.communities = data;
      },
      error: (err) => {
        console.error('Error al obtener comunidades:', err);
      }
    });
  }
  
  fetchCalendarEvents(): void {
    this.apiService.getEvents('550e8400-e29b-41d4-a716-446655440000').subscribe({
      next: (events: any[]) => {
        events.forEach(ev => {
          const day = new Date(ev.dateOfTheEvent).getDate();
          // Si no existe la entrada para ese día, se crea el array
          if (!this.calendarEvents[day]) {
            this.calendarEvents[day] = [];
          }
          // Solo se agregan hasta 3 eventos por día
          if (this.calendarEvents[day].length < 3) {
            this.calendarEvents[day].push(ev.title);
          }
        });
        console.log('Eventos del calendario:', this.calendarEvents);
      },
      error: (err) => {
        console.error('Error al obtener eventos de calendario:', err);
      }
    });
  }
  

  // Unirte a un evento
  joinEvent(eventId: string, communityID: string): void {
    this.apiService.createUserEvent('550e8400-e29b-41d4-a716-446655440000', eventId, communityID).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Te has unido al evento correctamente.',
          confirmButtonText: 'OK'
        });

        this.allFeedItems = this.allFeedItems.filter(item => item.id !== eventId);
        this.displayedFeedItems = this.displayedFeedItems.filter(item => item.id !== eventId);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Ups',
          text: 'Ha ocurrido un error al unirte al evento.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // Unirte a una comunidad
  joinCommunity(communityId: string): void {
    console.log('communityId', communityId);
    this.apiService.joinCommunity('550e8400-e29b-41d4-a716-446655440000', communityId).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Te has unido a la comunidad correctamente.',
          confirmButtonText: 'OK'
        });

        this.communities = this.communities.filter(c => c.ID !== communityId);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Ups',
          text: 'Ha ocurrido un error al unirte a la comunidad.: ' + err.message,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // Generar la estructura del calendario (solo las celdas)
  generateCalendar(): void {
    const today = new Date();
    this.todayDay = today.getDate();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = [];

    // Celdas vacías antes del día 1
    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }

    // Agregar días del mes
    for (let day = 1; day <= totalDays; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // Completar la última semana
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }
    this.calendarWeeks = weeks;
  }
}
