import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarMonth {
  month: number; // 0 = Enero, 11 = Diciembre
  year: number;
  weeks: (number | null)[][];
}

@Component({
  selector: 'app-events-community-calendar',
  standalone: true,  // si usas componentes standalone
  imports: [CommonModule],
  templateUrl: './events-community-calendar.component.html',
  styleUrls: ['./events-community-calendar.component.css']
})
export class EventsCommunityCalendarComponent implements OnInit {
  // Fecha base para generar el calendario (se actualizará al navegar)
  currentDate: Date = new Date();
  // Nombres de los días
  dayNames: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  // Día actual para resaltar (del mes actual)
  today: number = new Date().getDate();
  // Objeto que contendrá el mes actual a mostrar
  calendarMonth!: CalendarMonth;

  ngOnInit(): void {
    this.generateCalendarMonth();
  }

  // Genera la estructura para el mes actual basado en currentDate
  generateCalendarMonth(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const weeks = this.generateCalendarForMonth(year, month);
    this.calendarMonth = { year, month, weeks };
  }

  // Genera la estructura (matriz de semanas) para un mes específico
  generateCalendarForMonth(year: number, month: number): (number | null)[][] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = [];

    // Agregar celdas vacías hasta el primer día del mes
    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }

    // Llenar con los días del mes
    for (let day = 1; day <= totalDays; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // Completar la última semana con celdas vacías
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }
    return weeks;
  }

  // Navega al mes anterior y actualiza el calendario
  prevMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendarMonth();
  }

  // Navega al mes siguiente y actualiza el calendario
  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendarMonth();
  }
}
