import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CommunityCardComponent} from './community-card/community-card.component';
import {AuthService} from '../../services/auth.service';
import {CommunityService} from "../../../architecture/services/CommunityService";
import {forkJoin} from "rxjs";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Community} from "../../../architecture/model/Community";
import {WebSocketFactory} from "../../services/api-services/WebSocketFactory.service";
import {JoinRequest} from "../../../architecture/model/JoinRequest";
import {RequestStatus} from "../../../architecture/model/RequestStatus";
import {CommunityUser} from "../../../architecture/model/CommunityUser";
import {JoinCommunityCommand} from "../../commands/JoinCommunityCommand";
import {LeaveCommunityCommand} from "../../commands/LeaveCommunityCommand";
import {RemoveCommunityCommand} from "../../commands/RemoveCommunityCommand";
import {CancelJoinRequestCommunityCommand} from "../../commands/CancelJoinRequestCommunityCommand";
import {RouterCommand} from "../../commands/RouterCommand";
import {DataCacheService} from "../../services/cache/data-cache.service";

@Component({
    selector: 'app-comunities',
    standalone: true,
    imports: [FormsModule, CommonModule, CommunityCardComponent],
    templateUrl: './comunities.component.html',
    styleUrl: './comunities.component.css'
})
export class ComunitiesComponent {
    protected communities: { [key: string]: Community } = {};
    protected joinedCommunities: { [key: string]: Community } = {};
    protected notJoinedCommunities: { [key: string]: Community } = {};
    protected requests: { [key: string]: JoinRequest } = {};
    protected limit = 2;
    protected offset: number = 0;
    protected maxReached: boolean = false;
    protected searchTerm: string = '';

    constructor(
        protected serviceFactory: ServiceFactory,
        protected authService: AuthService,
        private socketFactory: WebSocketFactory,
        protected cache: DataCacheService
    ) {
    }

    ngOnInit() {
        this.loadCommunities();
        const communitiesSocket = this.socketFactory.get('Communities');
        const requestsSocket = this.socketFactory.get('JoinRequests');
        const communityUserSocket = this.socketFactory.get('CommunityUser');
        communitiesSocket.onUpdate().subscribe(res => this.onUpdateCommunity(res.new as Community));
        communitiesSocket.onDelete().subscribe(res => this.onDeleteCommunity(res.old as Community));
        requestsSocket.onInsert().subscribe(res => this.onInsertRequest(res.new as JoinRequest));
        requestsSocket.onUpdate().subscribe(res => this.onUpdateRequests(res.new as JoinRequest));
        requestsSocket.onDelete().subscribe(res => this.onDeleteRequests(res.old as JoinRequest));
        communityUserSocket.onInsert().subscribe(res => this.onJoinCommunity(res.new as CommunityUser));
        communityUserSocket.onDelete().subscribe(res => this.onLeaveCommunity(res.old as CommunityUser));
    }

    private onUpdateCommunity(community: Community) {
        (this.serviceFactory.get('communities') as CommunityService).getCommunity(community.id!).subscribe(res => {
            this.communities[community.id!] = res.data[0];
            this.joinedCommunities[community.id!] = res.data[0];
            this.notJoinedCommunities[community.id!] = res.data[0];
        });
    }

    private onDeleteCommunity(community: Community) {
        delete this.communities[community.id!];
        if (community.id! in this.joinedCommunities) delete this.joinedCommunities[community.id!]
        else delete this.notJoinedCommunities[community.id!]
    }

    private getCommunitiesIDsFrom(data: Community[]) {
        return data.map(c => c.id!);
    }

    filterCommunities(event?: Event): void {
        if (event) event.preventDefault();

        const term = this.searchTerm.toLowerCase().trim();

        this.communities = Object.fromEntries(Object.entries(this.communities).filter(([id, community]) => (String(community.name).toLowerCase().includes(term)) ||
            (String(community.description).toLowerCase().includes(term))))
    }

    loadCommunities() {
        if (this.maxReached) return;
        (this.serviceFactory.get('communities') as CommunityService).getCommunitiesPaginated(this.limit, this.offset).subscribe(res => {
            const communitiesIDs = this.getCommunitiesIDsFrom(res.data);
            forkJoin({
                joined: (this.serviceFactory.get('communities') as CommunityService).getUserCommunitiesFrom(this.authService.getUserUUID(), communitiesIDs),
                notJoined: (this.serviceFactory.get('communities') as CommunityService).getCommunitiesExcludingUserFrom(this.authService.getUserUUID(), communitiesIDs)
            }).subscribe(res => {
                res.joined.data.forEach(c => this.joinedCommunities[c.id!] = c);
                res.notJoined.data.forEach(c => this.notJoinedCommunities[c.id!] = c);
                (this.serviceFactory.get('communities') as CommunityService).getUserJoinRequestOf(this.authService.getUserUUID(), Object.keys(this.notJoinedCommunities)).subscribe(res => {
                    res.data.filter(r => r.status === RequestStatus.PENDING).forEach(r => this.requests[r.communityID!] = r);
                })
                this.communities = this.sortCommunities();
                if (res.joined.data.length > 0 || res.notJoined.data.length > 0) this.offset += this.limit;
                else this.maxReached = true;
            });
        });
    }

    private applyCommunitiesChanges(addingList: { [key: string]: Community }, removingList: {
        [key: string]: Community
    }, community: Community) {
        addingList[community.id!] = community;
        delete removingList[community.id!];
        this.communities = this.sortCommunities();
    }

    private sortCommunities() {
        return {...this.joinedCommunities, ...this.notJoinedCommunities};
    }

    private onInsertRequest(request: JoinRequest) {
        this.requests[request.communityID] = request;
    }

    private onUpdateRequests(request: JoinRequest) {
        if (request.status === RequestStatus.ACCEPTED) this.applyCommunitiesChanges(this.joinedCommunities, this.notJoinedCommunities, this.communities[request.communityID!])
        delete this.requests[request.communityID];
    }

    private onDeleteRequests(request: JoinRequest) {
        this.requests = Object.fromEntries(Object.entries(this.requests).filter(([, r]) => r.id !== request.id));
    }

    private onJoinCommunity(communityUser: CommunityUser) {
        if (communityUser.userID !== this.authService.getUserUUID()) return;
        if (this.communities[communityUser.communityID] === undefined) return;
        this.applyCommunitiesChanges(this.joinedCommunities, this.notJoinedCommunities, this.communities[communityUser.communityID]);
    }

    private onLeaveCommunity(communityUser: CommunityUser) {
        if (communityUser.userID !== this.authService.getUserUUID()) return;
        if (this.communities[communityUser.communityID] === undefined) return;
        this.applyCommunitiesChanges(this.notJoinedCommunities, this.joinedCommunities, this.communities[communityUser.communityID]);
    }

    protected readonly Object = Object;
    protected readonly JoinCommunityCommand = JoinCommunityCommand;
    protected readonly LeaveCommunityCommand = LeaveCommunityCommand;
    protected readonly RemoveCommunityCommand = RemoveCommunityCommand;
    protected readonly CancelJoinRequestCommunityCommand = CancelJoinRequestCommunityCommand;
    protected readonly RouterCommand = RouterCommand;
}
