import {Component} from '@angular/core';
import {UserCardComponent} from './user-card/user-card.component';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {CommunityService} from "../../../architecture/services/CommunityService";
import {forkJoin} from "rxjs";
import {User} from "../../../architecture/model/User";
import {CommunityRole} from "../../../architecture/model/CommunityRole";
import {Community} from "../../../architecture/model/Community";
import {Notify} from "../../services/notify";
import { LanguageService } from '../../language.service';

@Component({
    selector: 'app-moderators-management',
    standalone: true,
    imports: [UserCardComponent, FormsModule],
    templateUrl: './moderators-management.component.html',
    styleUrls: ['./moderators-management.component.css']
})
export class ModeratorsManagementComponent {
    searchText: string = '';
    allMembers: User[] = [];
    members: User[] = [];
    moderators: User[] = [];
    communityID: string = '';
    protected changes: {[key: string]: CommunityRole[]} = {};
    filter: string = 'all';
    protected community!: Community;

    constructor(
        private route: ActivatedRoute,
        private serviceFactory: ServiceFactory,
        private router: Router,
        private notify: Notify,
        private languageService: LanguageService
    ) {
    }

    fetchUsers(): void {
        forkJoin({
            members: (this.serviceFactory.get('communities') as CommunityService).getCommunityMembers(this.communityID),
            moderators: (this.serviceFactory.get('communities') as CommunityService).getCommunityModerators(this.communityID)
        }).subscribe(res => {
            this.moderators = res.moderators.data;
            this.members = res.members.data;
            this.orderMemberByRole();
        });
    }

    ngOnInit() {
        this.changes = {};
        this.route.queryParams.subscribe(params => {
            this.communityID = params['communityID'];
            (this.serviceFactory.get('communities') as CommunityService).getCommunity(this.communityID).subscribe(res => this.community = res.data[0]);
            this.fetchUsers();
        });
    }

    updateRole(id: string, newRole: CommunityRole) {
        const member = this.allMembers.find(m => m.id === id)!;

        if (!this.changes[member.id]) this.changes[member.id] = [this.moderators.find(m => m.id === member.id) ? CommunityRole.MODERATOR : CommunityRole.MEMBER, newRole];
        else this.changes[member.id][1] = newRole;

        this.swapUserGivenRole(member, newRole);

        if (this.changes[member.id] && this.changes[member.id][0] === this.changes[member.id][1]) delete this.changes[member.id];
        this.orderMemberByRole();
    }

    exitPage(event: Event) {
        event.preventDefault();
        let inform = (this.languageService.current == 'en') ? 'Do you want to leave without saving?' : '¿Quieres salir sin guardar?'
        if (Object.keys(this.changes).length) throw this.notify.confirm(inform).then(confirm => {
            if (confirm) this.router.navigate(["/community"], {queryParams: {communityID: this.communityID, isUserJoined: true}}).then();
            else {
                let title = (this.languageService.current == 'en') ? 'Save changes before leaving this panel' : 'Guarda los cambios antes de salir'
                let text = (this.languageService.current == 'en') ? 'Your changes could still be saved!' : 'Los cambios pueden ser guardados'
                this.notify.error(title, text);
            } 
        })
        else this.router.navigate(["/community"], {queryParams: {communityID: this.communityID, isUserJoined: true}}).then();
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
                this.orderMemberByRole();
                break;
        }
    }

    protected saveChanges() {
        let inform = (this.languageService.current == 'en') ? 'Do you want to save the changes?' : '¿Quieres guardar los cambios?';
        if (this.changes) this.notify.confirm(inform).then(confirm => {
            if (confirm) this.changeUsersRoles();
            else {
                let title = (this.languageService.current == 'en') ? 'Changes not saved' : 'Cambios no guardados'
                let text = (this.languageService.current == 'en') ? 'Changes cancelled' : 'Los cambios no fueron efectuados'
                this.notify.error(title, text);
            } 
        });
    }

    protected readonly CommunityRole = CommunityRole;

    private changeUsersRoles() {
        Object.entries(this.changes).forEach(([userID, userRoles]) => (this.serviceFactory.get('communities') as CommunityService).changeUserCommunityRole(this.communityID, userID, userRoles[1]).subscribe({
            next: () => {
                this.notify.success('Changes successfully saved!');
                this.changes = {};
            },
            error: res =>{
                let title = (this.languageService.current == 'en') ? `An error occurred!: ${res.error}` : `Ocurrió un error: ${res.error}`
                let text = (this.languageService.current == 'en') ? 'Changes could not be saved' : 'Los cambios no fueron efectuados'
                this.notify.error(title, text)
            } 
        }));
    }

    protected readonly Object = Object;

    resetChanges() {
        Object.entries(this.changes).forEach(([userID, userRoles]) => {
            const member = this.allMembers.find(m => m.id === userID)!;
            this.swapUserGivenRole(member, userRoles[0]);
        });
        this.changes = {};
        this.orderMemberByRole();
    }
    
    private orderMemberByRole() {
        this.allMembers = [...this.moderators, ...this.members];
    }

    private swapUserGivenRole(user: User, role: CommunityRole) {
        if (role === CommunityRole.MODERATOR) {
            this.members = this.members.filter(m => m.id !== user.id);
            this.moderators.push(user);
        } else {
            this.moderators = this.moderators.filter(m => m.id !== user.id);
            this.members.push(user);
        }
    }
}
