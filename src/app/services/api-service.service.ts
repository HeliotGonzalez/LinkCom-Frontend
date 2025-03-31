// api.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateCommunityParameters} from "../interfaces/create-community-parameters";
import {CreateEventParameters} from "../interfaces/create-event-parameters";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'http://localhost:3000'; // Ajusta si tu backend corre en otro host/puerto

    constructor(private http: HttpClient) {
    }

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
        return this.http.post(`${this.baseUrl}/createEventUser`, {userID, eventID, communityID});
    }

    // Un usuario se une a una comunidad
    joinCommunity(userID: string, communityID: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/joinCommunity`, {userID, communityID});
    }

    createCommunity(data: CreateCommunityParameters) {
        return this.http.post(`${this.baseUrl}/createCommunity`, data);
    }

    storeImage(image: string, directory: string) {
        return this.http.post(`${this.baseUrl}/storeImage`, { image, directory })
    }

    updateCommunityImage(imagePath: string, communityID: string) {
        return this.http.post(`${this.baseUrl}/updateCommunityImage`, { imagePath, communityID });
    }

    updateEventImage(imagePath: string, communityID: string, eventID: number) {
        return this.http.post(`${this.baseUrl}/updateEventImage`, { imagePath, communityID, eventID });
    }

    getCommunities(): Observable<any> {
        return this.http.get(`${this.baseUrl}/communities`);
    }

    createEvent(data: CreateEventParameters) {
        return this.http.post(`${this.baseUrl}/createEvent`, data);
    }

    getInterests() {
        return this.http.get(`${this.baseUrl}/interests`);
    }
}
