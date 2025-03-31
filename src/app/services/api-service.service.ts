// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000'; // URL del endpoint de Node.js

  constructor(private http: HttpClient) { }

  // Método para obtener datos del backend
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
