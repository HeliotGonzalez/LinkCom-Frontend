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

  // Obtener feed (eventos + noticias)
  getFeed(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/feed?userId=${userId}`);
  }

  // Obtener comunidades a las que NO pertenece el usuario
  getNonBelongingCommunities(userId: string): Observable<any> {
    console.log('ID: ' + userId);
    return this.http.get(`${this.baseUrl}/nonBelongingCommunities?userId=${userId}`);
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
    return this.http.post(`${this.baseUrl}/joinCommunity`, {userID, communityID});
  }

  createCommunity(userID: string, description: string | null, name: string, isPrivate: boolean, communityInterests: string[]) {
    return this.http.post(`${this.baseUrl}/createCommunity`, { userID, description, name, isPrivate,communityInterests });
  }

  getCommunities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/communities`);
  }

  createEvent(title: string, description: string, communityID: string, userID: string, dateOfTheEvent: Date) {
    return this.http.post(`${this.baseUrl}/createEvent`, { title, description, communityID, userID, dateOfTheEvent })
  }

  getInterests() {
    return this.http.get(`${this.baseUrl}/interests`);
  }

  getData() {
    return this.http.get(this.baseUrl);
  }

  getModerators(communityId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users?communityID=${communityId}`);
  }

  updateUserRole(communityId: string, userId: string, role: string): Observable<any> {
    console.log(`Updating user role: communityId=${communityId}, userId=${userId}, role=${role}`);
    return this.http.get(`${this.baseUrl}/updateusers?communityID=${communityId}&userID=${userId}&role=${role}`);
  }

  getComunnityInfo(communityId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/community?communityID=${communityId}`);
  }
}
