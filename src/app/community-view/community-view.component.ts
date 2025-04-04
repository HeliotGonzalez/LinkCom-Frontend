import {booleanAttribute, Component} from '@angular/core';
import {Community} from "../interfaces/community";
import {EventViewComponent} from "../event-view/event-view.component";
import {CommunityEvent} from "../interfaces/CommunityEvent";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../services/api-service.service";
import {AuthService} from "../services/auth.service";
import Swal from "sweetalert2";
import {Announce} from "../interfaces/announce";
import {AnnouncementCardComponent} from "../announcements-list/announcement-card/announcement-card.component";

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
    protected events: CommunityEvent[] | null = [];
    protected community: Community | null = null;
    protected userEvents: CommunityEvent[] | null = [];
    protected isUserJoined: boolean = false;
    protected announcements: Announce[] = [];

    constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private authService: AuthService) {
    }

    async fetchAnnouncements() {
        return new Promise<void>((resolve, reject) => {
            if(this.community?.id) {
                reject("CommunityID missing.");
                return;
            }

            this.apiService.getAnnouncements(this.community!.id).subscribe({
                next: (res) => {
                    if (res) {
                        console.log(res);
                        this.announcements = res.data;
                        resolve();
                    } else {
                        reject("No data received");
                    }
                },
                error: (err) => {
                    console.error("Error fetching announcements", err);
                    reject(err);
                }
            });
        });
    }

    async ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.isUserJoined = params['isUserJoined'];
            console.log(params['isUserJoined'])
            console.log(this.isUserJoined)
            this.apiService.getCommunity(params['communityID'])
                .subscribe({
                    next: res => {
                        // @ts-ignore
                        this.community = res['data'][0] as Community;
                        // @ts-ignore
                        this.apiService.getAnnouncements(res['data'][0]['id']).subscribe({
                            next: res => {
                                this.announcements = res.data.slice(0, 3);
                            }
                        });
                        // @ts-ignore
                        this.apiService.getCommunityEvents(this.community?.id).subscribe({
                            next: res => {
                                // @ts-ignore
                                for (const evt: CommunityEvent of Object.values(res['data'])) {
                                    // @ts-ignore
                                    this.events.push(evt);
                                }
                                this.apiService.getUserEvents(this.authService.getUserUUID()).subscribe(res => {
                                    // @ts-ignore
                                    for (const evt: CommunityEvent of Object.values(res['data'])) {
                                        // @ts-ignore
                                        this.userEvents.push(evt);
                                    }
                                });
                            }
                        });
                    }
                });
        });
    }

    protected showEventForm() {
        this.router.navigate(["/firstStepEventCreation"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }

    protected showAnnouncementForm() {
        this.router.navigate(["/announcementCreation"], {queryParams: {communityID: this.community?.id, communityName: this.community?.name, userID: this.community?.userID}}).then(r => {
        });
    }

    protected showAnnouncements() {
        this.router.navigate(["/announcementsList"], {queryParams: {communityID: this.community?.id, communityName: this.community?.name, communityImgPath: this.community?.imagePath}});
    }

    showModeratorsManagement() {
        this.router.navigate(["/moderatorsManagement"], {queryParams: {communityID: this.community?.id}}).then(r => {
        });
    }

    isUserInEvent(event: CommunityEvent): boolean {
        return this.userEvents?.map(e => e.id).includes(event.id)!;
    }

    isCreator() {
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
        this.apiService.joinCommunity(this.authService.getUserUUID(), this.community!.id).subscribe({
            next: res => {
                Swal.fire({
                    title: "Success!",
                    text: `Welcome to ${this.community?.name} community!`,
                    icon: "success"
                });
            },
            error: res => {
                Swal.fire({
                    title: "An error occurred!",
                    text: `We could not add you to ${this.community?.name} community! Please, try again later.`,
                    icon: "error"
                });
            }
        })
    }

    removeCommunity() {
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
            confirmButtonText: "Yes, remove!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.apiService.removeCommunity(this.community?.id!)
                    .subscribe({
                        next: res => {
                            swalWithBootstrapButtons.fire({
                                title: "Removed!",
                                text: "You have removed the community.",
                                icon: "success"
                            });
                            this.router.navigate(['communities']).then(r => {});
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
}
