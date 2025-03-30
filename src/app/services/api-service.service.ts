// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // Ajusta si tu backend corre en otro host/puerto

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api`);
  }

  // Obtener feed (eventos + noticias)
  getFeed(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/feed?userId=${userId}`);
  }

  // Obtener comunidades a las que NO pertenece el usuario
  getCommunities(userId: string): Observable<any> {
    console.log('ID: ' + userId);
    return this.http.get(`${this.baseUrl}/communities?userId=${userId}`);
  }

  // Obtener eventos para el calendario
  getEvents(userID: string): Observable<any> {
    console.log('ID: ' + userID);
    return this.http.get(`${this.baseUrl}/getCalendarEvents?userID=${userID}`);
  }

  // Se crea una instancia de EventUser en la base de datos (Usuario que pertenece a un evento)
  createUserEvent(userID: string, eventID: string, communityID: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/createEventUser`, { userID, eventID, communityID });
  }  

  // Un usuario se une a una comunidad
  joinCommunity(userID: string, communityID: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/joinCommunity`, { userID, communityID });
  }
}
