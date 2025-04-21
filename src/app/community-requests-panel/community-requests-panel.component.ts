import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunityRequestComponent} from "../community-request/community-request.component";
import {ActivatedRoute} from "@angular/router";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";
import {WebSocketFactory} from "../services/api-services/WebSocketFactory.service";
import {User} from "../../architecture/model/User";
import {JoinRequest} from "../../architecture/model/JoinRequest";
import {UserService} from "../../architecture/services/UserService";
import {AuthService} from "../services/auth.service";
import {RequestStatus} from "../../architecture/model/RequestStatus";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-community-requests-panel',
    animations: [
        trigger('fadeDialog', [
            state('void', style({ opacity: 0, transform: 'scale(0.95)' })),
            state('*', style({ opacity: 1, transform: 'scale(1)' })),
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.95)' }),
                animate('200ms ease-out')
            ]),
            transition(':leave', [
                animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
            ])
        ])
    ],
    imports: [
        CommunityRequestComponent
    ],
    templateUrl: './community-requests-panel.component.html',
    styleUrl: './community-requests-panel.component.css'
})
export class CommunityRequestsPanelComponent {
    @Input() isVisible!: boolean;
    @Output() eventEmitter = new EventEmitter();
    protected community: Community | null = null;
    protected users: User[] = [];
    protected requests: JoinRequest[] = [];

    constructor(
        private route: ActivatedRoute,
        private serviceFactory: ServiceFactory,
        private socketFactory: WebSocketFactory,
        private auth: AuthService
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            (this.serviceFactory.get('communities') as CommunityService).getCommunity(params['communityID']).subscribe(res => {
                this.community = res.data[0];
                this.fetchRequests();
                const socket = this.socketFactory.get('JoinRequests');
                socket.onInsert().subscribe(res => this.fetchRequests());
                socket.onDelete().subscribe(res => this.fetchRequests());
                socket.onUpdate().subscribe(res => this.fetchRequests());
            });
        });
    }

    fetchRequests() {
        (this.serviceFactory.get('communities') as CommunityService).getCommunityJoinRequests(this.community?.id!).subscribe(res => {
            this.requests = res.data.filter(r => r.status === RequestStatus.PENDING)
            const usersIDs = this.requests.map(r => r.userID);
            (this.serviceFactory.get('users') as UserService).getUsers(usersIDs).subscribe(res => this.users = res.data);
        });
    }

    rejectRequest(user: User) {
        const request = this.requests.find(r => r.userID === user.id);
        (this.serviceFactory.get('communities') as CommunityService).updateJoinRequest(
            request?.id!, this.auth.getUserUUID(), new Date(), RequestStatus.REJECTED
        ).subscribe();
    }


    acceptRequest(user: User) {
        const request = this.requests.find(r => r.userID === user.id);
        (this.serviceFactory.get('communities') as CommunityService).updateJoinRequest(
            request?.id!, this.auth.getUserUUID(), new Date(), RequestStatus.ACCEPTED
        ).subscribe();
    }

    close() {
        this.eventEmitter.emit();
    }
}
