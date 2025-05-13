import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FriendRequest } from '../../../architecture/model/FriendRequest';
import { RequestStatus } from '../../../architecture/model/RequestStatus';
import { User } from '../../../architecture/model/User';
import { ActivatedRoute } from '@angular/router';
import { ServiceFactory } from '../../services/api-services/ServiceFactory.service';
import { WebSocketFactory } from '../../services/api-services/WebSocketFactory.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../../architecture/services/UserService';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { CommunityRequestComponent } from '../community-request/community-request.component';

@Component({
    selector: 'app-friend-requests-panel',
    templateUrl: './friend-requests-panel.component.html',
    styleUrls: ['./friend-requests-panel.component.css'],
    standalone: true,
    imports: [CommonModule, CommunityRequestComponent],
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
    ]
})
export class FriendRequestsPanelComponent {
    @Input() isVisible: boolean = false;
    @Output() closePanel = new EventEmitter();

    protected requests: FriendRequest[] = [];
    protected users: User[] = [];

    constructor(
        private serviceFactory: ServiceFactory,
        private socketFactory: WebSocketFactory,
        private auth: AuthService
    ) {}

    ngOnInit() {
        const userID = this.auth.getUserUUID();

        this.fetchRequests(userID);

        const socket = this.socketFactory.get('FriendRequests');
        socket.onInsert().subscribe(() => this.fetchRequests(userID));
        socket.onUpdate().subscribe(() => this.fetchRequests(userID));
        socket.onDelete().subscribe(() => this.fetchRequests(userID));
    }

    fetchRequests(userID: string) {
        const userService = this.serviceFactory.get('users') as UserService;
        userService.getFriendRequests(userID).subscribe(res => {
            this.requests = res.data.filter(r => r.status === RequestStatus.PENDING);
            const userIDs = this.requests.map(r => r.from);
            userService.getUsers(userIDs).subscribe(res => this.users = res.data);
        });
    }

    rejectRequest(user: User) {
        const request = this.requests.find(r => r.from === user.id);
        const userService = this.serviceFactory.get('users') as UserService;
        userService.updateFriendRequest(request!.from, request!.to, RequestStatus.REJECTED).subscribe();
    }

    acceptRequest(user: User) {
        const request = this.requests.find(r => r.from === user.id);
        const userService = this.serviceFactory.get('users') as UserService;
        userService.updateFriendRequest(request!.from, request!.to, RequestStatus.ACCEPTED).subscribe();
    }

    close() {
        this.closePanel.emit();
    }
}
