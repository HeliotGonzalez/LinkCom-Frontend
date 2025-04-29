import {Component} from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {OnInit} from '@angular/core';
import {HeaderVisibilityService} from './services/header-visibility.service';
import {ServiceFactory} from "./services/api-services/ServiceFactory.service";
import {HTTPCommunityService} from "./services/api-services/HTTPCommunity.service";
import {HTTPEventService} from "./services/api-services/HTTPEventService";
import {HTTPUserService} from "./services/api-services/HTTPUserService";
import {WebSocketFactory} from "./services/api-services/WebSocketFactory.service";
import {io} from "socket.io-client";
import {WebSocketService} from "../architecture/io/WebSocketService";
import {Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [
        HeaderComponent,
        CommonModule,
        RouterOutlet,
    ],
    standalone: true
})
export class AppComponent implements OnInit {
    title = 'LinkCom-FrontEnd';
    data: any;
    fontSize: any;
    email: string = '';
    showHeader = true;
    url = 'http://localhost:3000';
    socketUrl = 'http://localhost:3001';

    constructor(
        private http: HttpClient,
        private headerService: HeaderVisibilityService,
        private serviceFactory: ServiceFactory,
        private socketFactory: WebSocketFactory,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.headerService.showHeader$.subscribe(show => {
            setTimeout(() => {
                this.showHeader = show;
            });
        });
        this.fillServiceFactory();
        this.fillSocketFactory();
    }

    private fillServiceFactory() {
        this.serviceFactory
            .put('communities', new HTTPCommunityService(this.http, this.url))
            .put('events', new HTTPEventService(this.http, this.url))
            .put('users', new HTTPUserService(this.http, this.url))
    }

    private fillSocketFactory() {
        const socket = io(this.socketUrl);
        this.socketFactory
            .put('Communities', new WebSocketService(socket, 'Communities'))
            .put('Community', new WebSocketService(socket, 'Community'))
            .put('CommunityUser', new WebSocketService(socket, 'CommunityUser'))
            .put('JoinRequests', new WebSocketService(socket, 'JoinRequests'))
    }

    onSubmit() {
        const apiUrl = 'http://localhost:3000/add-email';
        const payload = {email: this.email};

        this.http.post(apiUrl, payload).subscribe(
            (response) => {
                console.log('Email submitted successfully:', response);
                alert('Email submitted successfully!');
            },
            (error) => {
                console.error('Error submitting email:', error);
                alert('Failed to submit email.');
            }
        );
    }

      /** Comprueba si hay alguna ruta activa en el outlet "modal" */
    isModalOpen(): boolean {
        return this.router.routerState.snapshot.root.children
        .some(c => c.outlet === 'modal');
    }

    /** Cierra el modal navegando a outlet null */
    closeModal() {
        this.router.navigate([{ outlets: { modal: null } }]);
    }
}
