import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunityRequestComponent} from "../community-request/community-request.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {CommunityService} from "../../../architecture/services/CommunityService";
import {Community} from "../../../architecture/model/Community";
import {WebSocketFactory} from "../../services/api-services/WebSocketFactory.service";
import {User} from "../../../architecture/model/User";
import {JoinRequest} from "../../../architecture/model/JoinRequest";
import {UserService} from "../../../architecture/services/UserService";
import {AuthService} from "../../services/auth.service";
import {RequestStatus} from "../../../architecture/model/RequestStatus";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NotificationService} from "../../../architecture/services/NotificationService";
import {NotificationType} from "../../../architecture/model/NotificationType";

@Component({
    selector: 'app-community-requests-panel',
    animations: [
        trigger('fadeDialog', [
            state('void', style({opacity: 0, transform: 'scale(0.95)'})),
            state('*', style({opacity: 1, transform: 'scale(1)'})),
            transition(':enter', [
                style({opacity: 0, transform: 'scale(0.95)'}),
                animate('200ms ease-out')
            ]),
            transition(':leave', [
                animate('150ms ease-in', style({opacity: 0, transform: 'scale(0.95)'}))
            ])
        ])
    ],
    imports: [
        CommunityRequestComponent
    ],
    templateUrl: './community-requests-panel.component.html',
    standalone: true,
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
        private auth: AuthService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            (this.serviceFactory.get('communities') as CommunityService).getCommunity(params.get('id')!).subscribe(res => {
                this.community = res.data[0];
                this.fetchRequests();
                const socket = this.socketFactory.get('JoinRequests');
                socket.onInsert().subscribe(res => this.fetchRequests());
                socket.onDelete().subscribe(res => this.fetchRequests());
                socket.onUpdate().subscribe(res => this.fetchRequests());
            });
        });
        this.socketFactory.get('JoinRequests').onInsert().subscribe(() => this.fetchRequests());
        this.socketFactory.get('JoinRequests').onUpdate().subscribe(() => this.fetchRequests());
        this.socketFactory.get('JoinRequests').onDelete().subscribe(() => this.fetchRequests());
    }

    fetchRequests() {
        (this.serviceFactory.get('communities') as CommunityService).getCommunityJoinRequests(this.community?.id!).subscribe(res => {
            this.requests = res.data.filter(r => r.status === RequestStatus.PENDING);
            const usersIDs = this.requests.map(r => r.userID);
            (this.serviceFactory.get('users') as UserService).getUsers(usersIDs).subscribe(res => this.users = res.data);
        });
    }

    rejectRequest(user: User) {
        const request = this.requests.find(r => r.userID === user.id);
        (this.serviceFactory.get('communities') as CommunityService).updateJoinRequest(
            request?.id!, this.auth.getUserUUID(), new Date(), RequestStatus.REJECTED
        ).subscribe();
        (this.serviceFactory.get('notifications') as NotificationService).removeFromRelated([request?.id!]).subscribe();
    }

    acceptRequest(user: User) {
        const request = this.requests.find(r => r.userID === user.id);
        (this.serviceFactory.get('communities') as CommunityService).updateJoinRequest(
            request?.id!, this.auth.getUserUUID(), new Date(), RequestStatus.ACCEPTED
        ).subscribe();
        (this.serviceFactory.get('notifications') as NotificationService).send({
            recipientID: user.id!,
            relatedID: this.community?.id!,
            type: NotificationType.COMMUNITY
        }).subscribe();
        (this.serviceFactory.get('notifications') as NotificationService).removeFromRelated([request?.id!]).subscribe();
    }

    close() {
        this.router.navigate([{outlets:{ modal: null}}]).then();
    }
}
