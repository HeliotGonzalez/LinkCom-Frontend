import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-community-card',
  imports: [],
  templateUrl: './community-card.component.html',
  styleUrl: './community-card.component.css'
})
export class CommunityCardComponent {
  @Input() name!: Text;
  @Input() description!: Text;
}
