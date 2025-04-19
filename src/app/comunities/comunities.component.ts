import {Component} from '@angular/core';
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

@Component({
    selector: 'app-comunities',
    standalone: true,
    imports: [FormsModule, CommonModule, CommunityCardComponent],
    templateUrl: './comunities.component.html',
    styleUrl: './comunities.component.css'
})
export class ComunitiesComponent {
    protected communities: Community[] = [];
    protected joinedCommunities: Community[] = [];
    protected notJoinedCommunities: Community[] = [];
    protected limit = 2;
    protected offset: number = 0;
    protected maxReached: boolean = false;
    protected searchTerm: string = '';

    constructor(
        private router: Router,
        private serviceFactory: ServiceFactory,
        private authService: AuthService,
        private notify: Notify
    ) {
    }

    async ngOnInit() {
        this.loadCommunities();
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
                next: () => this.notify.success('The request has been sent! Now you have to wait for a response'),
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
        } else {
            (this.serviceFactory.get('communities') as CommunityService).joinCommunity(community.id!, this.authService.getUserUUID()).subscribe({
                next: () => {
                    this.notify.success('You have join this community!');
                    this.notJoinedCommunities = this.notJoinedCommunities.filter(c => c.id !== community.id);
                    this.joinedCommunities.push(community);
                    this.communities = [...this.joinedCommunities, ...this.notJoinedCommunities]
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
                    this.joinedCommunities = this.joinedCommunities.filter(c => c.id !== community.id);
                    this.notJoinedCommunities.push(community);
                    this.communities = [...this.joinedCommunities, ...this.notJoinedCommunities];
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
                this.joinedCommunities = this.joinedCommunities.concat(res.joined.data);
                this.notJoinedCommunities = this.notJoinedCommunities.concat(res.notJoined.data);
                if (res.joined.data.length > 0 || res.notJoined.data.length > 0) this.offset += this.limit;
                else this.maxReached = true;
                this.communities = [...this.joinedCommunities, ...this.notJoinedCommunities];
            });
        });
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
}
