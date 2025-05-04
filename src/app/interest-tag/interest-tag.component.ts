import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-interest-tag',
  imports: [],
  templateUrl: './interest-tag.component.html',
  standalone: true,
  styleUrl: './interest-tag.component.css'
})
export class InterestTagComponent {
  @Input() interestName: string = "";
  @Output() removeInterestEmitter = new EventEmitter<string>();

  remove() {
    this.removeInterestEmitter.emit(this.interestName);
  }
}
