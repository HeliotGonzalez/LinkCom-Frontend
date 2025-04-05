import {Component} from '@angular/core';
import {Community} from "../interfaces/community";
import {EventViewComponent} from "../event-view/event-view.component";
import {CommunityEvent} from "../model/CommunityEvent";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../services/api-service.service";
import {AuthService} from "../services/auth.service";
import Swal from "sweetalert2";
import {ApiResponse} from "../interfaces/ApiResponse";
import {Announce} from "../interfaces/announce";
import {AnnouncementCardComponent} from "../announcements-list/announcement-card/announcement-card.component";
import {ApiServiceTranslator} from "../model/ApiServiceTranslator";
import {CommunityApiService} from "../services/api-services/community-api.service";
import {AlertService} from "../services/alert.service";

@Component({
    selector: 'app-community-view',
    imports: [
        EventViewComponent,
        AnnouncementCardComponent
    ],
    templateUrl: './community-view.component.html',
    standalone: true,
    styleUrl: './community-view.component.css'
})
export class CommunityViewComponent {
    protected events: CommunityEvent[] = [];
    protected community: Community | null = null;
    protected userEvents: CommunityEvent[] = [];
    protected isUserJoined: boolean = false;
    protected announcements: Announce[] = [];

    constructor(private router: Router, private route: ActivatedRoute, private alertService: AlertService, private communityApi: CommunityApiService, private apiServiceTranslator: ApiServiceTranslator, private apiService: ApiService, private authService: AuthService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.isUserJoined = params['isUserJoined'];

            this.apiService.getCommunity(params['communityID']).subscribe(res => {
                this.community = (res as ApiResponse<Community>).data[0];
            });

            this.apiService.getCommunityEvents(params['communityID']).subscribe(res => {
                this.events = (res as ApiResponse<CommunityEvent>).data;
            });

            this.apiService.getUserEvents(this.authService.getUserUUID()).subscribe(res => {
                this.userEvents = (res as ApiResponse<CommunityEvent>).data;
            });
        });
    }

    protected showEventForm() {
        this.router.navigate(["/firstStepEventCreation"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }

    showModeratorsManagement() {
        this.router.navigate(["/moderatorsManagement"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }

    protected isUserInEvent(event: CommunityEvent): boolean {
        return this.userEvents?.map(e => e.id).includes(event.id)!;
    }

    protected isCreator() {
        return this.authService.getUserUUID() === this.community?.userID;
    }

    leaveCommunity() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, leave!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.apiService.leaveCommunity(this.authService.getUserUUID(), this.community?.id!)
                    .subscribe({
                        next: res => {
                            swalWithBootstrapButtons.fire({
                                title: "Left!",
                                text: "You have left the community.",
                                icon: "success"
                            });
                            this.router.navigate(['homepage']).then(r => {});
                        },
                        error: res => {
                            swalWithBootstrapButtons.fire({
                                title: "An error occurred!",
                                text: `We could not process your request: ${res['message']}`,
                                icon: "error"
                            });
                        }
                    })
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your still being with us!",
                    icon: "error"
                });
            }
        });
    }

    joinCommunity() {
        this.apiServiceTranslator.joinCommunity(this.community!, this.authService.getUserUUID());
        this.communityApi.joinCommunity(this.community!).subscribe({
            next: () => {
                this.alertService.success(`You have joined ${this.community?.name}'s community!`);
            },
            error: res => {
                this.alertService.error(`We could not added you to this community: ${(res as ApiResponse<any>).message}`)
            }
        });
    }

    removeCommunity() {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, remove!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.apiService.removeCommunity(this.community?.id!)
                    .subscribe({
                        next: res => {
                            Swal.fire({
                                title: "Removed!",
                                text: "You have removed the community.",
                                icon: "success"
                            });
                            this.router.navigate(['communities']).then(r => {});
                        },
                        error: res => {
                            Swal.fire({
                                title: "An error occurred!",
                                text: `We could not process your request: ${res['message']}`,
                                icon: "error"
                            });
                        }
                    })
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Your still being with us!",
                    icon: "error"
                });
            }
        });
    }

    showAnnouncements() {

    }

    showAnnouncementForm() {

    }
}
