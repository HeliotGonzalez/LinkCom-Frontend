import {Component} from '@angular/core';
import {UserCardComponent} from './user-card/user-card.component';
import {FormsModule} from '@angular/forms';
import {ApiService} from '../services/api-service.service';
import {ActivatedRoute} from "@angular/router";

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
    filterRole: string = 'All';
    members: any[] = [];
    communityID: string = '';

    constructor(private route: ActivatedRoute, private apiService: ApiService) {
    }

    fetchUsers(): void {
        this.apiService.getModerators(this.communityID).subscribe({
            next: (res) => {
                this.members = res.data;
            },
            error: (err) => {
                console.error('Error al obtener usuarios:', err);
            }
        });
    }

    fetchCommunity(): void {
        this.apiService.getCommunityInfo(this.communityID).subscribe({
            next: (res) => {
                this.communityName = res.data[0].name;
            },
            error: (err) => {
                console.error('Error al obtener comunidad:', err);
            }
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.communityID = params['communityID'];
        });
        this.fetchCommunity();
        this.fetchUsers();
    }

    get filteredMembers() {
        return this.members
            .filter(member => {
                const roleLower = member.communityRole.toLowerCase();
                if (roleLower === 'creator') return false;
                return (this.filterRole.toLowerCase() === 'all' || roleLower === this.filterRole.toLowerCase()) &&
                    member.username.toLowerCase().includes(this.searchText.toLowerCase());
            })
            .sort((a, b) => a.communityRole === 'member' ? 1 : -1);
    }

    updateRole(id: number, newRole: string) {
        const member = this.members.find(m => m.id === id);
        if (member) {
            this.apiService.updateUserRole(this.communityID, id.toString(), newRole).subscribe({
                next: (res) => {
                    member.communityRole = newRole;
                },
                error: (err) => {
                    console.error('Error al actualizar el rol:', err);
                }
            });
        }
    }
}
