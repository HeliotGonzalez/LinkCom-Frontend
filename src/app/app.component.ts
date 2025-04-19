import {Component} from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {CommonModule} from '@angular/common';
import {ApiService} from './services/api-service.service';
import {RouterOutlet} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {OnInit} from '@angular/core';
import {HeaderVisibilityService} from './services/header-visibility.service';
import {ServiceFactory} from "./services/api-services/ServiceFactory.service";
import {HTTPCommunityService} from "./services/api-services/HTTPCommunity.service";
import {HTTPEventService} from "./services/api-services/HTTPEventService";
import {HTTPUserService} from "./services/api-services/HTTPUserService";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [
        HeaderComponent,
        CommonModule,
        RouterOutlet,
    ],
})
export class AppComponent implements OnInit {
    title = 'LinkCom-FrontEnd';
    data: any;
    fontSize: any;
    email: string = '';
    showHeader = true;
    url = 'http://localhost:3000'

    constructor(private apiService: ApiService, private http: HttpClient, private headerService: HeaderVisibilityService, private serviceFactory: ServiceFactory) {
    }

    ngOnInit() {
        this.headerService.showHeader$.subscribe(show => {
            setTimeout(() => {
                this.showHeader = show;
            });
        });
        this.fillServiceFactory();
    }

    private fillServiceFactory() {
        this.serviceFactory
            .put('communities', new HTTPCommunityService(this.http, this.url))
            .put('events', new HTTPEventService(this.http, this.url))
            .put('users', new HTTPUserService(this.http, this.url))
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

}
