import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CommunityCardComponent} from "./community-card/community-card.component";
import {ApiService} from '../services/api-service.service';
import {Community} from "../interfaces/community";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-comunities',
    standalone: true,
    imports: [FormsModule, CommonModule, CommunityCardComponent],
    templateUrl: './comunities.component.html',
    styleUrl: './comunities.component.css'
})
export class ComunitiesComponent {
    protected communities: Community[] = [];
    protected userCommunitiesIDs: string[] = [];

    constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {
    }

    async fetchCommunities(): Promise<void> {
        return new Promise((resolve) => {
            let completedRequests = 0;

            this.apiService.getCommunities().subscribe({
                next: (res) => {
                    console.log(res)
                    this.communities = res;
                    completedRequests++;
                    if (completedRequests === 2) resolve();
                },
                error: (err) => console.error('Error al obtener comunidades:', err),
            });

            this.apiService.getUserCommunities(this.authService.getUserUUID()).subscribe({
                next: (res) => {
                    // @ts-ignore
                    this.userCommunitiesIDs = (res['data'] || []).map(c => c['id']);
                    completedRequests++;
                    if (completedRequests === 2) resolve();
                },
                error: (err) => console.error('Error al obtener comunidades del usuario:', err),
            });
        });
    }

    async ngOnInit() {
        await this.fetchCommunities();
        console.log(this.userCommunitiesIDs);  // Ahora tendrá los datos
    }

    showCommunityForm() {
        this.router.navigate(['firstStepCommunityCreation']).then(r => {});
    }

    joinCommunity(community: Community) {
        this.apiService.joinCommunity(this.authService.getUserUUID(), community.id).subscribe({
            next: res => {
                this.userCommunitiesIDs.push(community.id);
                Swal.fire({
                    title: "Success!",
                    text: `Welcome to ${community?.name} community!`,
                    icon: "success"
                });
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
                this.apiService.leaveCommunity(this.authService.getUserUUID(), community?.id!)
                    .subscribe({
                        next: res => {
                            this.userCommunitiesIDs = this.userCommunitiesIDs.filter(id => id !== community.id);
                            swalWithBootstrapButtons.fire({
                                title: "Left!",
                                text: "You have left the community.",
                                icon: "success"
                            });
                        },
                        error: res => {
                            swalWithBootstrapButtons.fire({
                                title: "An error occurred!",
                                text: `We could not process your request: ${res['message']}`,
                                icon: "error"
                            });
                        }
                    });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "You're still with us!",
                    icon: "error"
                });
            }
        });
    }
}






