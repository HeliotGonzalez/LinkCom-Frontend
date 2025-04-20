import {Component} from '@angular/core';
import {CommunityRequestComponent} from "../community-request/community-request.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";
import {WebSocketFactory} from "../services/api-services/WebSocketFactory.service";
import {User} from "../../architecture/model/User";
import {JoinRequest} from "../../architecture/model/JoinRequest";
import {UserService} from "../../architecture/services/UserService";
import {AuthService} from "../services/auth.service";
import {RequestStatus} from "../../architecture/model/RequestStatus";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
    selector: 'app-community-requests-panel',
    imports: [
        CommunityRequestComponent
    ],
    templateUrl: './community-requests-panel.component.html',
    styleUrl: './community-requests-panel.component.css'
})
export class CommunityRequestsPanelComponent {
    protected community: Community | null = null;
    protected users: User[] = [];
    protected requests: JoinRequest[] = [];

    constructor(
        private router: Router,
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

    closePanel() {
        this.route.queryParams.subscribe(params => this.router.navigate(["/community"], {queryParams: {communityID: params['communityID']}}).then(r => {
        }))
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
}
