// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api`);
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
}
