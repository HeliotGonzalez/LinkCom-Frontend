import {Component} from '@angular/core';
import {UserCardComponent} from './user-card/user-card.component';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {CommunityService} from "../../../architecture/services/CommunityService";
import {forkJoin} from "rxjs";
import {User} from "../../../architecture/model/User";
import {CommunityRole} from "../../../architecture/model/CommunityRole";

@Component({
    selector: 'app-moderators-management',
    standalone: true,
    imports: [UserCardComponent, FormsModule],
    templateUrl: './moderators-management.component.html',
    styleUrls: ['./moderators-management.component.css']
})
export class ModeratorsManagementComponent {
    communityName: string = '';
    searchText: string = '';
    allMembers: User[] = [];
    members: User[] = [];
    moderators: User[] = [];
    communityID: string = '';
    filter: string = 'all';

    constructor(
        private route: ActivatedRoute,
        private serviceFactory: ServiceFactory,
        private router: Router
    ) {
    }

    fetchUsers(): void {
        forkJoin({
            members: (this.serviceFactory.get('communities') as CommunityService).getCommunityMembers(this.communityID),
            moderators: (this.serviceFactory.get('communities') as CommunityService).getCommunityModerators(this.communityID)
        }).subscribe(res => {
            this.moderators = res.moderators.data;
            this.members = res.members.data;
            this.allMembers = [...res.moderators.data, ...res.members.data];
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.communityID = params['communityID'];
            this.fetchUsers();
        });
    }

    updateRole(id: string, newRole: CommunityRole) {
        const member = this.allMembers.find(m => m.id === id)!;
        (this.serviceFactory.get('communities') as CommunityService).changeUserCommunityRole(this.communityID, member.id, newRole).subscribe(res => {
            if (res.data[0].communityRole === CommunityRole.MEMBER) {
                this.moderators = this.moderators.filter(m => m.id !== member.id);
                this.members.push(member);
            } else {
                this.members = this.members.filter(m => m.id !== member.id);
                this.moderators.push(member);
            }
            this.allMembers = [...this.moderators, ...this.members];
        })
    }

    exitPage(event: Event) {
        event.preventDefault();
        this.router.navigate(["/community"], {queryParams: {communityID: this.communityID, isUserJoined: true}}).then();
    }

    filterMembers() {
        switch (this.filter) {
            case 'moderator':
                this.allMembers = this.moderators;
                break;
            case 'member':
                this.allMembers = this.members;
                break;
            case 'all':
                this.allMembers = [...this.moderators, ...this.members]
                break;
        }
    }

    protected readonly CommunityRole = CommunityRole;
}
