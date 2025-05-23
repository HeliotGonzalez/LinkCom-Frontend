import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';
import { FeedItem } from '../../interfaces/feed-item';
import { LanguageService } from '../../language.service';
import { Router } from '@angular/router';
import {ApiResponse} from "../../interfaces/ApiResponse";
import {CommunityEvent} from "../../../architecture/model/CommunityEvent";
import { Community } from '../../../architecture/model/Community';
import { trigger, transition, style, animate,} from '@angular/animations';
import { RouterModule } from '@angular/router';
interface CalendarMonth {
  month: number;
  year: number;
  monthName: string;
  weeks: (number | null)[][];
}

@Component({
  selector: 'app-events-community-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './events-community-calendar.component.html',
  styleUrls: ['./events-community-calendar.component.css'],
  animations: [
    trigger('fade', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('3000ms ease-in-out', style({ opacity: 1 }))
      ])
    ]),

    trigger('slide', [
      transition('* <=> *', [
        style({ transform: 'translateX(20px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),

    trigger('zoom', [
      transition('* <=> *', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('1000ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class EventsCommunityCalendarComponent implements OnInit {
  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  today: number = this.currentDate.getDate();
  calendarMonth!: CalendarMonth;
  selectedEvent: { title: string; description: string; date: Date; imagePath: string; communityID: string;} | null = null;
  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarEvents: { [day: number]: { title: string; description: string ;  date: Date; imagePath:string; communityID: string;}[] } = {};
  events: CommunityEvent[] = [];
  userid: string;
  communityNames = new Map<string, string>();
  communityInterests  = new Map<string, string[]>();
  selectedDayEvents: {
    title: string;
    description: string;
    date: Date;
    imagePath: string;
    communityID: string;
  }[] = [];
  
  selectedIdx = 0;
  selectedDay: number | null = null;

selectDay(day: number): void {
  this.selectedDay = this.selectedDay === day ? null : day;
}

get dailyEvents() {
  if (!this.selectedDay) return [];
  return this.calendarEvents[this.selectedDay] || [];
}


  openEventModal(day: number, idx: number): void {
    this.selectedDayEvents = this.calendarEvents[day] || [];
    this.selectedIdx       = idx;
    this.selectedEvent     = this.selectedDayEvents[idx];
  }
  prevEvent(): void {
    if (this.selectedDayEvents.length < 2) return;
    this.selectedIdx = (this.selectedIdx - 1 + this.selectedDayEvents.length) 
                         % this.selectedDayEvents.length;
    this.selectedEvent = this.selectedDayEvents[this.selectedIdx];
  }
  nextEvent(): void {
    if (this.selectedDayEvents.length < 2) return;
    this.selectedIdx = (this.selectedIdx + 1) % this.selectedDayEvents.length;
    this.selectedEvent = this.selectedDayEvents[this.selectedIdx];
  }
  get filteredMonthlyEvents() {
  return this.events.filter(ev => {
    const d = new Date(ev.date);
    return (
      d.getMonth() === this.calendarMonth.month &&
      d.getFullYear() === this.calendarMonth.year
    );
  });
}


  public getDotColorFromName(name: string): string {
    let hash = 0;
    console.log(name);
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; 
    }
    console.log(hash);
  

    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += value.toString(16).padStart(2, '0');
    }
    console.log(color);
    return color;
  }
  

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.userid = this.authService.getUserUUID();
  }


  private loadCommunities(): void {
    this.apiService.getCommunities().subscribe({
      next: (res: ApiResponse<Community>) => {
        res.data
          .filter(c => c.id && c.name)     // descartamos nulos
          .forEach(c => {
            this.communityNames.set(c.id!, c.name!);
  
            // guarda intereses (puede venir undefined)
            const ints = c.interests?.map(i => i.interest) ?? [];
            this.communityInterests.set(c.id!, ints);
          });
      },
      error: err => console.error('Error al cargar comunidades', err)
    });
  }

  openEventModalFromList(event: {
  title: string;
  description: string;
  date: Date;
  imagePath: string;
  communityID: string;
  // Si tienes más propiedades, añádelas aquí
}): void {
  this.selectedDayEvents = this.events
    .filter(ev => {
      const date = new Date(ev.date);
      return (
        date.getDate() === new Date(event.date).getDate() &&
        date.getMonth() === new Date(event.date).getMonth() &&
        date.getFullYear() === new Date(event.date).getFullYear()
      );
    })
    .map(ev => ({
      title: ev.title,
      description: ev.description,
      date: new Date(ev.date),
      imagePath: ev.imagePath,
      communityID: ev.communityID,
    }));

  this.selectedIdx = this.selectedDayEvents.findIndex(e => e.title === event.title);
  this.selectedEvent = event;
}

getEventWithParsedDate(ev: any): any {
  // If ev.date is a string, parse it to a Date object, otherwise return as is
  return {
    ...ev,
    date: ev.date instanceof Date ? ev.date : new Date(ev.date)
  };
}


  ngOnInit(): void {
    this.checkLanguage();
    this.generateCalendarMonth();
    this.loadCommunities();
    if (this.userid === 'user_id') {
      console.log('No existe usuario');
      return;
    }

    
    this.apiService.getEvents(this.authService.getUserUUID()).subscribe({
      next: res => {
        console.log(res);
        this.events = (res as ApiResponse<CommunityEvent>).data;
        this.calendarEvents = {};

        this.events.forEach(ev => {
          const eventDate = new Date(ev.date); 
          const day = eventDate.getDate();
          const month = eventDate.getMonth();
          const year = eventDate.getFullYear();

          if (month === this.calendarMonth.month && year === this.calendarMonth.year) {
            if (!this.calendarEvents[day]) {
              this.calendarEvents[day] = [];
            }

            console.log(this.calendarEvents[day])

            this.calendarEvents[day].push({
              title: ev.title,
              description: ev.description,
              date: new Date(ev.date),
              imagePath: ev.imagePath,
              communityID: ev.communityID,
            });
          }
        });

        console.log('Eventos agrupados por día:', this.calendarEvents);
      },
      error: (err) => {
        console.error('Error al obtener eventos:', err);
      }
    });
  }

  private checkLanguage(): void {
    this.dayNames = this.languageService.current === 'es'
      ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  public getCommunityName(id?: string): string {
    if (!id) return '—';
    return this.communityNames.get(id) ?? 'Comunidad desconocida';
  }

  public getCommunityInterests(id?: string): string {
    if (!id) return '—';
    const ints = this.communityInterests.get(id);
    return ints && ints.length ? ints.join(' · ') : '—';
  }

  generateCalendarMonth(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const monthName = this.getMonthName(month);
    const weeks = this.generateCalendarForMonth(year, month);
    this.calendarMonth = { year, month, monthName, weeks };
  }
  

  generateCalendarForMonth(year: number, month: number): (number | null)[][] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    return weeks;
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendarMonth();
    this.ngOnInit(); // Recargar eventos del mes nuevo
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendarMonth();
    this.ngOnInit(); // Recargar eventos del mes nuevo
  }

  getMonthName(month: number): string {
    const locale = this.languageService.current === 'es' ? 'es-ES' : 'en-US';
    let monthName = new Date(this.currentDate.getFullYear(), month).toLocaleString(locale, { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  }


  navigateToEvent(day: number | null): void {
    if (!day) return;

    const match = this.events.find(ev => {
      const eventDate = new Date(ev.date); // o ev.date
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === this.calendarMonth.month &&
        eventDate.getFullYear() === this.calendarMonth.year
      );
    });

    if (match) {
      this.router.navigate(['/event', match.id]);
    }
  }
}
