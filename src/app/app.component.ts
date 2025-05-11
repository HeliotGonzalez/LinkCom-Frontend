import {Component} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {CommonModule} from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
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
import {CommandBuilderFactory} from "./command-builder-factory.service";
import {Notify} from "./services/notify";
import {AuthService} from "./services/auth.service";
import {CriteriaBuilderFactory} from "../architecture/io/criteria/CriteriaBuilderFactory";
import {Filters} from "../architecture/io/criteria/Filters";
import {Order} from "../architecture/io/criteria/Order";
import {Criteria} from "../architecture/io/criteria/Criteria";
import {CriteriaSerializer} from "../architecture/io/criteria/CriteriaSerializer";
import {FilterOperator} from "../architecture/io/criteria/FilterOperator";
import {HTTPMessageService} from "./services/api-services/HTTPMessageService";
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
    email: string = '';
    showHeader = true;
    url = 'http://localhost:3000';
    socketUrl = 'http://localhost:3001';

    constructor(
        private http: HttpClient,
        private headerService: HeaderVisibilityService,
        private serviceFactory: ServiceFactory,
        private socketFactory: WebSocketFactory,
        private notify: Notify,
        private auth: AuthService,
        private router: Router,
        private commandBuilderFactory: CommandBuilderFactory
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
        this.fillCriteriaFactory();
    }

    private fillServiceFactory() {
        this.serviceFactory
            .put('communities', new HTTPCommunityService(this.http, this.url))
            .put('events', new HTTPEventService(this.http, this.url))
            .put('users', new HTTPUserService(this.http, this.url))
            .put('notify', this.notify)
            .put('auth', this.auth)
            .put('router', this.router)
            .put('messages', new HTTPMessageService(this.http, this.url))
    }

    private fillSocketFactory() {
        const socket = io(this.socketUrl);
        this.socketFactory
            .put('Communities', new WebSocketService(socket, 'Communities'))
            .put('Community', new WebSocketService(socket, 'Community'))
            .put('CommunityUser', new WebSocketService(socket, 'CommunityUser'))
            .put('JoinRequests', new WebSocketService(socket, 'JoinRequests'))
            .put('Events', new WebSocketService(socket, 'Events'))
            .put('EventUser', new WebSocketService(socket, 'EventUser'))
            .put('FriendRequests', new WebSocketService(socket, 'FriendRequests'))
            .put('Messages', new WebSocketService(socket, 'Messages'))
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

    private fillCriteriaFactory() {
        const factory = new CriteriaBuilderFactory();

        factory.register('test', {build: (filters: Filters, order: Order, limit?: number, offset?: number) => new Criteria(filters, order, limit, offset)});

        const test = factory.with(Filters.fromValues([
            {field: 'from', operator: '=', value: 'userid1'},
            {field: 'to', operator: '=', value: 'userid1'},
            {field: 'from', operator: '=', value: 'userid2'},
            {field: 'to', operator: '=', value: 'userid2'},
        ]), Order.asc('userID')).build('test');

        const serial = CriteriaSerializer.serialize(test);

        console.log(serial);

        console.log(JSON.parse(atob(serial)));
    }
}
