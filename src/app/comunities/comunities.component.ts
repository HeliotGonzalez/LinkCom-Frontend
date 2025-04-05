import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunityCardComponent } from './community-card/community-card.component';
import { ApiService } from '../services/api-service.service';
import { Community } from '../interfaces/community';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

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
    protected userCommunitiesIDs: string[] = [];

    protected searchTerm: string = '';
    private allCommunities: Community[] = [];

    constructor(
        private router: Router,
        private apiService: ApiService,
        private authService: AuthService
    ) {}

    async ngOnInit() {
        await this.fetchCommunities();
        console.log(this.userCommunitiesIDs);
    }

    async fetchCommunities(): Promise<void> {
        return new Promise((resolve) => {
            let completedRequests = 0;
            let allCommunities: Community[] = [];

            this.apiService.getCommunities().subscribe({
                next: (res) => {
                    allCommunities = res;
                    completedRequests++;
                    if (completedRequests === 2) {
                        this.allCommunities = allCommunities;
                        this.reorderCommunities(allCommunities);
                        resolve();
                    }
                },
                error: (err) => console.error('Error al obtener comunidades:', err),
            });

            this.apiService.getUserCommunities(this.authService.getUserUUID()).subscribe({
                next: (res: GetUserCommunitiesResponse) => {
                    this.userCommunitiesIDs = Array.isArray(res.data)
                        ? res.data.map(c => c.id)
                        : [];

                    completedRequests++;
                    if (completedRequests === 2) {
                        this.allCommunities = allCommunities;
                        this.reorderCommunities(allCommunities);
                        resolve();
                    }
                },
                error: (err) => {
                    console.error('Error al obtener comunidades del usuario:', err);
                    this.userCommunitiesIDs = [];
                    completedRequests++;
                    if (completedRequests === 2) {
                        this.allCommunities = allCommunities;
                        this.reorderCommunities(allCommunities);
                        resolve();
                    }
                }
            });
        });
    }

    private reorderCommunities(allCommunities: Community[]) {
        this.joinedCommunities = allCommunities.filter(c => this.userCommunitiesIDs.includes(c.id));
        this.notJoinedCommunities = allCommunities.filter(c => !this.userCommunitiesIDs.includes(c.id));
        this.communities = [...this.joinedCommunities, ...this.notJoinedCommunities];
    }

    filterCommunities(event?: Event): void {
        if (event) event.preventDefault();

        const term = this.searchTerm.toLowerCase().trim();

        const filtered = this.allCommunities.filter(c =>
            (String(c.name).toLowerCase().includes(term)) ||
            (String(c.description).toLowerCase().includes(term))
        );

        this.reorderCommunities(filtered);
    }

    showCommunityForm() {
        this.router.navigate(['firstStepCommunityCreation']).then();
    }

    joinCommunity(community: Community) {
        console.log('Intentando unirse a la comunidad:', community);
        this.apiService.joinCommunity(this.authService.getUserUUID(), community.id).subscribe({
            next: res => {
                if (!this.userCommunitiesIDs.includes(community.id)) {
                    this.userCommunitiesIDs.push(community.id);
                }

                Swal.fire({
                    title: "Success!",
                    text: `Welcome to ${community?.name} community!`,
                    icon: "success"
                });

                this.reorderCommunities(this.communities);
            },
            error: res => {
                Swal.fire({
                    title: "An error occurred!",
                    text: `We could not add you to ${community?.name} community! Please, try again later.`,
                    icon: "error"
                });
            }
        });
    }

    leaveCommunity(community: Community) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You can always come back!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, leave!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.apiService.leaveCommunity(this.authService.getUserUUID(), community.id).subscribe({
                    next: res => {
                        this.userCommunitiesIDs = this.userCommunitiesIDs.filter(id => id !== community.id);
                        this.reorderCommunities(this.communities);

                        Swal.fire("Left!", "You have left the community.", "success");
                    },
                    error: res => {
                        Swal.fire("Error!", `We could not process your request: ${res['message']}`, "error");
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "You're still with us!", "error");
            }
        });
    }
}
