import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from '../../services/api-service.service';
import {FeedItem} from '../../interfaces/feed-item';
import {Community} from '../../interfaces/community';
import {AuthService} from '../../services/auth.service';
import Swal from 'sweetalert2';
import {FeedEventCardComponent} from "../../components/feed-event-card/feed-event-card.component";
import {CommunityEvent} from "../../../architecture/model/CommunityEvent";

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css'],
    imports: [CommonModule, FeedEventCardComponent]
})
export class HomepageComponent implements OnInit {
    allFeedItems: FeedItem[] = [];
    displayedFeedItems: FeedItem[] = [];
    feedBatchSize: number = 2;

    communities: Community[] = [];

    feedEvents: CommunityEvent[] = [];

    // Calendario
    calendarWeeks: (number | null)[][] = [];
    dayNames: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    todayDay: number = 0;
    calendarEvents: { [day: number]: string[] } = {};

    constructor(private apiService: ApiService, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.fetchFeed();
        this.fetchCommunities();
        this.fetchCalendarEvents();

        this.apiService.getCommunitiesEventsExcludingUser(this.authService.getUserUUID())
            .subscribe({
                next: res => {
                    // @ts-ignore
                    this.feedEvents = res['data'] as CommunityEvent[];
                }
            });

        // Generar el calendario en sí (estructura de celdas)
        this.generateCalendar();
    }

    // Obtener feed del usuario (eventos + noticias)
    fetchFeed(): void {
        // Eventos y noticias
        this.apiService.getFeed(this.authService.getUserUUID()).subscribe({
            next: (data: FeedItem[]) => {
                this.allFeedItems = data.map(item => ({...item,date: new Date(item.date)}));

                console.log('Data recibido: ' + data);
                this.loadMoreFeed();
            },
            error: (err) => {
                console.error('Error al obtener feed:', err);
            }
        });
    }

    fetchExcludedEvents(): void {
        this.apiService.getCommunitiesEventsExcludingUser(this.authService.getUserUUID()).subscribe({
            next: (res: any) => this.feedEvents = res.data as CommunityEvent[],
            error: err => console.error('Error loading events:', err)
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
        this.apiService.getNonBelongingCommunities(this.authService.getUserUUID()).subscribe({
            next: (resp: { data: Community[] }) => {
                console.log('Comunidades recibidas:', resp);
                this.communities = resp.data;
            },
            error: (err) => {
                console.error('Error al obtener comunidades:', err);
            }
            });
    }

    fetchCalendarEvents(): void {
        this.apiService.getEvents(this.authService.getUserUUID()).subscribe({
            next: (res: { success: boolean; data: any[] }) => {
                const events = res.data || [];
                console.log('payload de eventos:', events);
          
                events.forEach(ev => {
                  const day = new Date(ev.date).getDate();
                  if (!this.calendarEvents[day]) {
                    this.calendarEvents[day] = [];
                  }
                  if (this.calendarEvents[day].length < 3) {
                    this.calendarEvents[day].push(ev.title);
                  }
                });
            },
            error: (err) => {
                console.error('Error al obtener eventos de calendario:', err);
            }
        });
    }

    // Unirte a un evento
    joinEvent(event: CommunityEvent) {
        this.apiService.joinEvent(this.authService.getUserUUID(), event?.communityID, event?.id)
            .subscribe({
                next: res => {
                    Swal.fire({
                        title: "Success!",
                        text: "You have joined the event.",
                        icon: "success"
                    }).then(() => {
                        this.feedEvents = this.feedEvents.filter(e => e.id !== event.id);
                        this.fetchCalendarEvents();
                    });
                },
                error: res => {
                    Swal.fire({
                        title: "An error occurred!",
                        text: "Something went wrong! Try to join later.",
                        icon: "error"
                    });
                }
            });
    }

    // Unirte a una comunidad
    joinCommunity(communityId: string): void {
        const userID = this.authService.getUserUUID();
        this.apiService.joinCommunity(userID, communityId).subscribe({
            next: response => {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Te has unido a la comunidad correctamente.',
                confirmButtonText: 'OK'
              }).then(() => {
                this.fetchCommunities();
                this.fetchFeed();
                this.fetchExcludedEvents();
              });
            },
            error: err => {
              Swal.fire({
                icon: 'error',
                title: 'Ups',
                text: 'Ha ocurrido un error al unirte a la comunidad: ' + (err.error?.message || err.message),
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
