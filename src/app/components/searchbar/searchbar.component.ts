import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './searchbar.component.html',
})
export class SearchbarComponent {
  query: string = '';

  onSearch() {
    console.log('Buscando:', this.query);
  }
}
