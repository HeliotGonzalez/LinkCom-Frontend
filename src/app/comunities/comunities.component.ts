import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comunities',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './comunities.component.html',
  styleUrl: './comunities.component.css'
})
export class ComunitiesComponent {
  query = '';
  comunidades = [1, 2, 3, 4]; 
}






