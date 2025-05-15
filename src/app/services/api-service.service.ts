// api.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateCommunityParameters} from "../interfaces/create-community-parameters";
import {CreateEventParameters} from "../interfaces/create-event-parameters";
import {ApiResponse} from "../interfaces/ApiResponse";
<<<<<<< HEAD
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import {CommunityEvent} from "../interfaces/CommunityEvent";
import { Community } from '../interfaces/community';
>>>>>>> 909b589 (feat: A user, who is leader, can edit an existing Community)
=======
import { User } from '../../architecture/model/User';
>>>>>>> 2426d70 (feat: A user can edit their data)
=======
import { User } from '../../architecture/model/User';
>>>>>>> d89c3e6003064a9d5f07d12c4c391a4451e01c5f

interface GetUserCommunitiesResponse {
    data: { id: string }[];
  }
  
@Injectable({
    providedIn: 'root'
})

export class ApiService {
    private baseUrl = 'http://localhost:3000'; // Ajusta si tu backend corre en otro host/puerto

    constructor(private http: HttpClient) {
    }

    
    // Obtener feed (eventos + noticias)
    getFeed(userId: string): Observable<any> {
        console.log('Yendo al back con ID: ' + userId);
        return this.http.get(`${this.baseUrl}/feed?userId=${userId}`);
    }

    // Obtener comunidades a las que NO pertenece el usuario
<<<<<<< HEAD
    getNonBelongingCommunities(userId: string): Observable<any> {
        console.log('ID: ' + userId);
        return this.http.get(`${this.baseUrl}/communities/nonBelongingCommunities?userId=${userId}`);
=======
    getNonBelongingCommunities(userID: string): Observable<any> {
        console.log('ID: ' + userID);
        return this.http.get(`${this.baseUrl}/communities/nonBelongingCommunities/${userID}`);
<<<<<<< HEAD
>>>>>>> 7cbb949 (refactor: Refactored the callout to the api in the nonBelonignCommunities)
=======
>>>>>>> d89c3e6003064a9d5f07d12c4c391a4451e01c5f
    }

    // Obtener eventos para el calendario
    getEvents(userID: string): Observable<any> {
        console.log('ID: ' + userID);
        return this.http.get(`${this.baseUrl}/users/${userID}/events`);
    }

    // Se crea una instancia de EventUser en la base de datos (Usuario que pertenece a un evento)
    createUserEvent(userID: string, eventID: string, communityID: string): Observable<any> {
        console.log('userID ' + userID + ' eventID: ' + eventID + ' communityID: ' + communityID);
        return this.http.post(`${this.baseUrl}/joinEvent`, {userID, eventID, communityID});
    }

    // Un usuario se une a una comunidad
    joinCommunity(userID: string, communityID: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/communityUser/joinCommunity`, {userID, communityID});
    }

    // Un usuario se une a una comunidad
    joinEvent(userID: string, communityID: string | undefined, eventID: string | undefined): Observable<any> {
        return this.http.put(`${this.baseUrl}/events/${eventID}/join`, {userID, communityID});
    }

    createCommunity(data: CreateCommunityParameters) {
        return this.http.post(`${this.baseUrl}/createCommunity`, data);
    }

    storeImage(image: string, directory: string) {
        return this.http.post(`${this.baseUrl}/storeImage`, {image, directory})
    }

    updateCommunityImage(imagePath: string, communityID: string) {
        return this.http.post(`${this.baseUrl}/updateCommunityImage`, {imagePath, communityID});
    }

    updateEventImage(imagePath: string, communityID: string, eventID: number) {
        return this.http.post(`${this.baseUrl}/updateEventImage`, {imagePath, communityID, eventID});
    }

    getCommunities(): Observable<any> {
        console.log(`${this.baseUrl}/communities`)
        return this.http.get(`${this.baseUrl}/communities`);
    }

    createEvent(data: CreateEventParameters) {
        return this.http.post(`${this.baseUrl}/createEvent`, data);
    }

    getInterests() {
        return this.http.get(`${this.baseUrl}/interests`);
    }

    getModerators(communityId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/users?communityID=${communityId}`);
    }

    updateUserRole(communityId: string, userId: string, role: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/updateusers?communityID=${communityId}&userID=${userId}&role=${role}`);
    }

    getCommunityInfo(communityId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/community?communityID=${communityId}`);
    }

    getCommunityEvents(communityID: string) {
        return this.http.get(`${this.baseUrl}/communityEvents?communityID=${communityID}`);
    }

    getUserEvents(userID: string): Observable<ApiResponse<CommunityEvent>> {
        return this.http.get<ApiResponse<CommunityEvent>>(`${this.baseUrl}/userEvents?userID=${userID}`);
    }

    leaveEvent(userID: string, eventID: string) {
        return this.http.post(`${this.baseUrl}/leaveEvent`, {userID, eventID});
    }

    leaveCommunity(userID: string, communityID: string) {
        return this.http.post(`${this.baseUrl}/leaveCommunity`, {userID, communityID});
    }

    getCommunity(communityID: string) {
        return this.http.get(`${this.baseUrl}/community?communityID=${communityID}`);
    }

    getCommunitiesEventsExcludingUser(userID: string) {
        return this.http.get(`${this.baseUrl}/communitiesEventsExcludingUser?userID=${userID}`);
    }

    getUserCommunities(userID: string): Observable<GetUserCommunitiesResponse> {
        return this.http.get<GetUserCommunitiesResponse>(`${this.baseUrl}/userCommunities?userID=${userID}`);
    }

    removeCommunity(communityID: string) {
        return this.http.get(`${this.baseUrl}/removeCommunity?communityID=${communityID}`);
    }

<<<<<<< HEAD
    createAnnouncement(title: string, body: string, communityID: string, publisherID: string) {
        return this.http.post(`${this.baseUrl}/createAnnouncement`, {title, body, communityID, publisherID});
    }

    getAnnouncements(communityID: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/announcements?communityID=${communityID}`);
    }

<<<<<<< HEAD
<<<<<<< HEAD

=======
    createAnnouncement(communityID: string, userID: string, title: string, body: string) {
        console.log('DATOS: ', { communityID, userID, title, body });
        if (!communityID || communityID.trim() === "") {
            throw new Error("El communityID es obligatorio y no puede estar vacío.");
        }
        return this.http.put(`${this.baseUrl}/announcement`, {
            communityID,
            publisherID: userID,
            title,
            body
        });
    }

    updateCommunity(communityID: string, formData: FormData) {
        return this.http.patch(`${this.baseUrl}/communities/${communityID}`, formData);
      }
      
>>>>>>> 909b589 (feat: A user, who is leader, can edit an existing Community)
=======
    updateCommunity(id: string, data: any): Observable<any> {
        console.log('Se obtuvo el id: ' + id);
        return this.http.patch<any>(
          `${this.baseUrl}/communities/${id}`,
          data
        );
    }
<<<<<<< HEAD
>>>>>>> a55b898 (feat: Community edit)
=======

    getUserProfile(userID: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/users/profile/${userID}`);
    }
<<<<<<< HEAD
>>>>>>> ad5282f (feat: User profile is visible)
=======
=======
    updateCommunity(id: string, data: FormData): Observable<any> {
        return this.http.patch(`${this.baseUrl}/communities/${id}`, data);
    }

    getUserProfile(userID: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/users/profile/${userID}`);
    }
>>>>>>> d89c3e6003064a9d5f07d12c4c391a4451e01c5f

    updateUser(id: string, payload: Partial<User>): Observable<any> {
        return this.http.patch(`${this.baseUrl}/users/${id}`, payload);
    }
<<<<<<< HEAD
>>>>>>> 2426d70 (feat: A user can edit their data)
=======
>>>>>>> d89c3e6003064a9d5f07d12c4c391a4451e01c5f
}
