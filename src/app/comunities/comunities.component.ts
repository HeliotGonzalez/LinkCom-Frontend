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

interface GetUserCommunitiesResponse {
    data: { id: string }[];
}

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

    protected searchTerm: string = '';

    constructor(
        private router: Router,
        private serviceFactory: ServiceFactory,
        private authService: AuthService,
        private notify: Notify
    ) {
    }

    async ngOnInit() {
        forkJoin({
            joined: (this.serviceFactory.get('communities') as CommunityService).getUserCommunities(this.authService.getUserUUID()),
            notJoined: (this.serviceFactory.get('communities') as CommunityService).getCommunitiesExcludingUser(this.authService.getUserUUID())
        }).subscribe(res => {
            this.joinedCommunities = res.joined.data;
            this.notJoinedCommunities = res.notJoined.data;
            this.communities = [...res.joined.data, ...res.notJoined.data];
        });
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
}
