// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000/api'; // URL del endpoint de Node.js

  constructor(private http: HttpClient) { }

  // Método para obtener datos del backend
  getData() {
    return this.http.get(this.apiUrl);
  }
}
