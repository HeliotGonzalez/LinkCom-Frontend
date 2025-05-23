import { Component } from '@angular/core';
import { trigger, transition, style, animate,} from '@angular/animations';
@Component({
  selector: 'app-reports-moddal',
  imports: [],
  templateUrl: './reports-moddal.component.html',
  styleUrl: './reports-moddal.component.css',
  animations: [

    trigger('slide', [
      transition(':enter', [
        style({ height: '0px', opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ height: '*', opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, transform: 'translateY(0)' }),
        animate('500ms ease-in', style({ height: '0px', opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
    ]
})
export class ReportsModdalComponent {

  isOtherReport: boolean = false;
  ngOnInit() 
  {
    this.isOtherReport = false;
  }
  toggleIsOtherReport() {
    this.isOtherReport = !this.isOtherReport;
  }

}
