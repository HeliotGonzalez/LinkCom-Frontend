import {booleanAttribute, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CommunityCardComponent} from './community-card/community-card.component';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {CommunityService} from "../../architecture/services/CommunityService";
import {forkJoin} from "rxjs";
import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {Community} from "../../architecture/model/Community";
import {WebSocketFactory} from "../services/api-services/WebSocketFactory.service";
import {JoinRequest} from "../../architecture/model/JoinRequest";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
    selector: 'app-comunities',
    standalone: true,
    imports: [FormsModule, CommonModule, CommunityCardComponent],
    templateUrl: './comunities.component.html',
    styleUrl: './comunities.component.css'
})
export class ComunitiesComponent {
    protected communities: Community[] = [];
    protected joinedCommunities: {[key: string]: Community} = {};
    protected notJoinedCommunities: {[key: string]: Community} = {};
    protected requests: {[key: string]: JoinRequest} = {};
    protected limit = 2;
    protected offset: number = 0;
    protected maxReached: boolean = false;
    protected searchTerm: string = '';

    constructor(
        private router: Router,
        private serviceFactory: ServiceFactory,
        private authService: AuthService,
        private notify: Notify,
        private socketFactory: WebSocketFactory
    ) {
    }

    async ngOnInit() {
        this.loadCommunities();
        const socket = this.socketFactory.get('Communities');
        socket.onUpdate().subscribe(res => this.onUpdateCommunity(res.new as Community));
        socket.onDelete().subscribe(res => this.onDeleteCommunity(res.new as Community));
    }

    private onUpdateCommunity(community: Community) {
        (this.serviceFactory.get('communities') as CommunityService).getCommunity(community.id!).subscribe(res => {
            const updateCommunity = this.communities.find(c => c.id === community.id);
            this.communities[this.communities.indexOf(updateCommunity!)] = res.data[0];
            this.joinedCommunities[community.id!] = res.data[0];
            this.notJoinedCommunities[community.id!] = res.data[0];
        });
    }

    private onDeleteCommunity(community: Community) {
        this.communities = this.communities.filter(c => c.id !== community.id);
    }

    private getCommunitiesIDsFrom(data: Community[]) {
        return data.map(c => c.id!);
    }

    filterCommunities(event?: Event): void {
        if (event) event.preventDefault();

        const term = this.searchTerm.toLowerCase().trim();

        this.communities = this.communities.filter(c =>
            (String(c.name).toLowerCase().includes(term)) ||
            (String(c.description).toLowerCase().includes(term))
        );
    }

    showCommunityForm() {
        this.router.navigate(['firstStepCommunityCreation']).then();
    }

    joinCommunity(community: Community) {
        if (community.isPrivate) {
            (this.serviceFactory.get('communities') as CommunityService).requestJoinToCommunity(community.id!, this.authService.getUserUUID()).subscribe({
                next: () => this.notify.info('Request sent!', 'The request has been sent! Now you have to wait for a response'),
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
        } else {
            (this.serviceFactory.get('communities') as CommunityService).joinCommunity(community.id!, this.authService.getUserUUID()).subscribe({
                next: () => {
                    this.notify.success('You have join this community!');
                    this.applyCommunitiesChanges(this.joinedCommunities, this.notJoinedCommunities, community);
                },
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
        }
    }

    leaveCommunity(community: Community) {
        this.notify.confirm(`You will be leaving ${community.name}'s community`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).leaveCommunity(community.id!, this.authService.getUserUUID()).subscribe({
                next: () => {
                    this.notify.success('You have left this community!');
                    this.applyCommunitiesChanges(this.notJoinedCommunities, this.joinedCommunities, community);
                },
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
        });
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
                    res.data.forEach(r => this.requests[r.communityID!] = r);
                    console.log(this.requests)
                })
                this.communities = this.orderCommunities();
                if (res.joined.data.length > 0 || res.notJoined.data.length > 0) this.offset += this.limit;
                else this.maxReached = true;
            });
        });
    }

    private applyCommunitiesChanges(addingList: {[key: string]: Community}, removingList: {[key: string]: Community}, community: Community) {
        addingList[community.id!] = community;
        delete removingList[community.id!];
        this.communities = this.orderCommunities();
    }

    private orderCommunities() {
        return Object.values(this.joinedCommunities).concat(Object.values(this.notJoinedCommunities))
    }

    removeCommunity(community: Community) {
        this.notify.confirm(`You will not be able to revert this: REMOVE ${community.name}'s community`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).removeCommunity(community.id!).subscribe({
                next: () => {
                    this.notify.success('You have removed this community!');
                    this.loadCommunities();
                },
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
            else this.notify.success('Your community is still safe!');
        });
    }

    protected readonly booleanAttribute = booleanAttribute;

    cancelRequest(community: Community) {
        this.notify.confirm(`Your join request will disappear!`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).cancelRequest(community.id!, this.authService.getUserUUID()).subscribe({
                next: () => {
                    this.notify.success('You have canceled this join request!');
                    this.loadCommunities();
                },
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
            else this.notify.error('Your request is still being processed', 'Process interrupted!');
        });
    }

    protected readonly Object = Object;
}
