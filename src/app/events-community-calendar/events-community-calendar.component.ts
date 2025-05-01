import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api-service.service';
import { AuthService } from '../services/auth.service';
import { FeedItem } from '../interfaces/feed-item';
import { Router } from '@angular/router';
import {ApiResponse} from "../interfaces/ApiResponse";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import { Community } from '../../architecture/model/Community';

interface CalendarMonth {
  month: number;
  year: number;
  monthName: string;
  weeks: (number | null)[][];
}

@Component({
  selector: 'app-events-community-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-community-calendar.component.html',
  styleUrls: ['./events-community-calendar.component.css']
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
  

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
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
  ngOnInit(): void {
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
    return new Date(this.currentDate.getFullYear(), month).toLocaleString('en-US', { month: 'long' });
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
