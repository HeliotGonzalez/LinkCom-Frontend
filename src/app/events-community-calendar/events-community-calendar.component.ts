import { Component, OnInit } from '@angular/core';

interface CalendarMonth {
  month: number; // 0 = Enero, 11 = Diciembre
  year: number;
  weeks: (number | null)[][];
}

@Component({
  selector: 'app-events-community-calendar',
  imports: [],
  templateUrl: './events-community-calendar.component.html',
  styleUrl: './events-community-calendar.component.css'

})

export class EventsCommunityCalendarComponent implements OnInit {
  protected img_evento: string | null = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7LZrNYPtb4UCleAD_Tf2nxE64eSUfKnRxEg&s"
   // Fecha base para generar los calendarios (se actualizará al navegar)
   currentDate: Date = new Date();
   // Número de meses a mostrar (actual + 3 siguientes = 4)
   numberOfMonths: number = 4;
   // Lista de meses con su estructura de semanas
   calendarMonths: CalendarMonth[] = [];
   // Nombres de los días (puedes ajustarlos a tu idioma)
   dayNames: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
   // Día actual para resaltar (del mes actual)
   today: number = new Date().getDate();
 
   ngOnInit(): void {
     this.generateCalendarMonths();
   }
 
   // Genera la estructura para cada mes a mostrar
   generateCalendarMonths(): void {
     this.calendarMonths = [];
     // Clonar la fecha actual para no modificar currentDate directamente
     let date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
     for (let i = 0; i < this.numberOfMonths; i++) {
       const weeks = this.generateCalendarForMonth(date.getFullYear(), date.getMonth());
       this.calendarMonths.push({
         month: date.getMonth(),
         year: date.getFullYear(),
         weeks: weeks
       });
       // Avanzamos un mes
       date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
     }
   }
 
   // Genera la estructura (matriz de semanas) para un mes específico
   generateCalendarForMonth(year: number, month: number): (number | null)[][] {
     const firstDay = new Date(year, month, 1);
     const lastDay = new Date(year, month + 1, 0);
     const startDay = firstDay.getDay();
     const totalDays = lastDay.getDate();
 
     const weeks: (number | null)[][] = [];
     let week: (number | null)[] = [];
 
     // Agregar celdas vacías hasta el primer día de la semana
     for (let i = 0; i < startDay; i++) {
       week.push(null);
     }
 
     // Llenar los días del mes
     for (let day = 1; day <= totalDays; day++) {
       week.push(day);
       if (week.length === 7) {
         weeks.push(week);
         week = [];
       }
     }
 
     // Completar la última semana con celdas vacías si es necesario
     if (week.length > 0) {
       while (week.length < 7) {
         week.push(null);
       }
       weeks.push(week);
     }
     return weeks;
   }
 
   // Navega al mes anterior (actualiza currentDate y genera el calendario)
   prevMonth(): void {
     this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
     this.generateCalendarMonths();
   }
 
   // Navega al mes siguiente (actualiza currentDate y genera el calendario)
   nextMonth(): void {
     this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
     this.generateCalendarMonths();
   }
 }

