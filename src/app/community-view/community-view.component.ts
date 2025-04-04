import {booleanAttribute, Component} from '@angular/core';
import {Community} from "../interfaces/community";
import {EventViewComponent} from "../event-view/event-view.component";
import {CommunityEvent} from "../interfaces/CommunityEvent";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../services/api-service.service";
import {AuthService} from "../services/auth.service";
import Swal from "sweetalert2";
import {combineLatest, of, switchMap, tap} from "rxjs";
import {ApiResponse} from "../interfaces/ApiResponse";

@Component({
    selector: 'app-community-view',
    imports: [
        EventViewComponent
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

    constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private authService: AuthService) {
    }

    ngOnInit() {
        this.route.queryParams.pipe(
            tap(params => {
                this.isUserJoined = params['isUserJoined'];
            }),
            switchMap(() => {
                if (!this.community) return of([null, null]);
                return combineLatest([
                    this.apiService.getCommunityEvents(this.community.id),
                    this.apiService.getUserEvents(this.authService.getUserUUID())
                ]);
            })
        ).subscribe(([communityEvents, userEvents]) => {
            if (communityEvents) {
                const communityEventsData = (communityEvents as ApiResponse<CommunityEvent>).data
                for (const evt of Object.values(communityEventsData ?? {})) {
                    this.events.push(evt as CommunityEvent);
                }
            }
            if (userEvents) {
                const userEventsData = (userEvents as ApiResponse<CommunityEvent>).data;
                for (const evt of Object.values(userEventsData ?? {})) {
                    this.userEvents.push(evt as CommunityEvent);
                }
            }
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
                            this.router.navigate(['homepage']).then(r => {
                            });
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
                            this.router.navigate(['communities']).then(r => {
                            });
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
