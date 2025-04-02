import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunityCardComponent } from "./community-card/community-card.component";
import { ApiService } from '../services/api-service.service';
import {Community} from "../interfaces/community";

@Component({
  selector: 'app-comunities',
  standalone: true,
  imports: [FormsModule, CommonModule, CommunityCardComponent],
  templateUrl: './comunities.component.html',
  styleUrl: './comunities.component.css'
})
export class ComunitiesComponent {
  commnunities: Community[] = [];
  nombre: string = 'Hola';

  constructor(private apiService: ApiService) {}

  fetchCommunities(): void {
    this.apiService.getCommunities().subscribe({
      next: (res) => {
          this.commnunities = res;
          console.log(this.commnunities);
      },
      error: (err) => {
          console.error('Error al obtener usuarios:', err);
      }
    });
  }
  ngOnInit() {
    this.fetchCommunities();
  }
}






