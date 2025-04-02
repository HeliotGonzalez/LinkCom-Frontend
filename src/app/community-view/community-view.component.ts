import {booleanAttribute, Component} from '@angular/core';
import {Community} from "../interfaces/community";
import {EventViewComponent} from "../event-view/event-view.component";
import {CommunityEvent} from "../interfaces/CommunityEvent";
import {Router} from "@angular/router";
import {ApiService} from "../services/api-service.service";
import {AuthService} from "../services/auth.service";
import Swal from "sweetalert2";

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
    protected events: CommunityEvent[] | null = [];
    protected community: Community | null = null;
    protected userEvents: CommunityEvent[] | null = [];

    constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {
    }

    ngOnInit() {
        this.community = {
            // @ts-ignore
            name: "Ducks",
            // @ts-ignore
            description: "",
            id: "bc98f5cd-2eb2-497a-8978-1f7179a46df9",
            userID: "51257452-72a3-4a6f-a6c9-79fa2af11606",
            isPrivate: true,
            imagePath: ""
        };
        // @ts-ignore
        this.apiService.getCommunityEvents(this.community?.id).subscribe(res => {
            // @ts-ignore
            // @ts-ignore
            for (const evt: CommunityEvent of Object.values(res['data'])) {
                // @ts-ignore
                this.events.push(evt);
            }
        });
        this.apiService.getUserEvents(this.authService.getUserUUID()).subscribe(res => {
            // @ts-ignore
            console.log(res)
            // @ts-ignore
            for (const evt: CommunityEvent of Object.values(res['data'])) {
                // @ts-ignore
                this.userEvents.push(evt);
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
}
