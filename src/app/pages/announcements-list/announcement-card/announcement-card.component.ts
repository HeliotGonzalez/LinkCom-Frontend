import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Announce } from '../../../interfaces/announce';

@Component({
    selector: 'app-announcement-card',
    imports: [],
    templateUrl: './announcement-card.component.html',
    standalone: true,
    styleUrl: './announcement-card.component.css'
})
export class AnnouncementCardComponent {
  
  @Input() announce!: Announce;
  @Input() imgPath!: string;
  
  constructor (private router: Router) {}

}
