import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FeedItem {
  id: number;
  type: 'event' | 'news';
  title: string;
  content: string;
  date: Date;
}

interface Community {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  imports: [CommonModule]
})
export class HomepageComponent implements OnInit {
  // Datos de ejemplo para el feed (eventos y noticias)
  allFeedItems: FeedItem[] = [
    { id: 1, type: 'event', title: 'Conferencia Angular', content: 'Únete a la conferencia anual de Angular.', date: new Date() },
    { id: 2, type: 'news', title: 'Nueva actualización', content: 'Se ha lanzado una nueva versión de nuestra plataforma.', date: new Date() },
    { id: 3, type: 'event', title: 'Meetup Tech', content: 'Evento de networking para profesionales tech.', date: new Date() },
    { id: 4, type: 'news', title: 'Lanzamiento de features', content: 'Descubre las nuevas funcionalidades que hemos implementado.', date: new Date() },
  ];

  // Items mostrados en el feed (lazy loading)
  displayedFeedItems: FeedItem[] = [];
  feedBatchSize: number = 2;

  // Datos de ejemplo para comunidades
  communities: Community[] = [
    { id: 1, name: 'Comunidad Angular', description: 'Espacio para compartir conocimientos sobre Angular.' },
    { id: 2, name: 'Tech Innovators', description: 'Un lugar para innovadores y amantes de la tecnología.' },
    { id: 3, name: 'Programadores Unidos', description: 'Comunidad para programadores de todas las especialidades.' },
  ];

  // Propiedades para el calendario
  calendarWeeks: (number | null)[][] = [];
  dayNames: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  todayDay: number = 0;
  /* 
    Se simulan eventos en el calendario. 
    La clave es el número del día y el valor es un array de cadenas con la información de cada evento.
    Por ejemplo, el día 15 tiene dos eventos y el día 22 uno.
  */
  calendarEvents: { [day: number]: string[] } = {
    15: ["Evento Especial: Reunión de Comunidad", "Otro Evento"],
    22: ["Meetup Tech"]
  };

  constructor() { }

  ngOnInit(): void {
    this.loadMoreFeed();
    this.generateCalendar();
  }

  loadMoreFeed(): void {
    const nextItems = this.allFeedItems.slice(
      this.displayedFeedItems.length,
      this.displayedFeedItems.length + this.feedBatchSize
    );
    this.displayedFeedItems = this.displayedFeedItems.concat(nextItems);
  }

  joinEvent(eventId: number): void {
    console.log('Unirse al evento con ID:', eventId);
  }

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
