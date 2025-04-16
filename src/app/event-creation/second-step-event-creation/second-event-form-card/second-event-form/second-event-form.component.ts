import {Component} from '@angular/core';
import {FormStepsComponent} from "../../../../form-steps/form-steps.component";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {FormService} from '../../../../services/form-service/form.service';
import {FormsModule} from '@angular/forms';
import {ApiService} from "../../../../services/api-service.service";
import Swal from "sweetalert2";
import {AuthService} from "../../../../services/auth.service";
import {EntitiesIdService} from "../../../../services/entitites-ids-service/entities-id.service";

@Component({
    selector: 'app-second-event-form',
    imports: [
        FormStepsComponent,
        NgIf,
        FormsModule
    ],
    templateUrl: './second-event-form.component.html',
    standalone: true,
    styleUrl: './second-event-form.component.css'
})
export class SecondEventFormComponent {
    protected formData: FormService | null = null;
    protected uploadedImage: string | null = null;
    protected eventDescription: string = "";

    constructor(
        private router: Router,
        private formService: FormService,
        private apiService: ApiService,
        private authService: AuthService,
        private entitiesService: EntitiesIdService
    ) {
    }

    previousPage(event: Event) {
        event.preventDefault();
        this.router.navigate(["/firstStepEventCreation"]).then(r => {
        });
        this.saveFormData();
    }

    async nextPage(event: Event) {
        event.preventDefault();

        this.saveFormData();

        if (this.eventDescription === "") {
            Swal.fire("Error!", "All required fields must be filled!", "error");
            return;
        }

        this.apiService.createEvent({
            title: this.formData?.get("name"),
            description: this.formData?.get("description"),
            communityID: this.formData?.get("communityID"),
            userID: this.authService.getUserUUID(),
            date: this.parseDate(this.formData?.get("date"), this.formData?.get("time")),
        }).subscribe({
            next: res => {
                Swal.fire({
                    title: "Success!",
                    text: "Your event has been correctly created!",
                    icon: "success",
                    confirmButtonText: "Continue"
                }).then(result => {
                    if (result.isConfirmed) {
                        this.router.navigate(['community'], {queryParams: {communityID: this.formData?.get('communityID')}})
                        // @ts-ignore
                        this.storeEventImage(res['data']['communityID'], res['data']['eventID']);
                        this.formService.remove("event");
                    }
                });
            },
            error: err => Swal.fire({
                title: "Error!",
                text: "We could not create your event.",
                icon: "error",
                confirmButtonText: "Continue"
            })
        });
    }

    private storeEventImage(communityID: string, eventID: number) {
        if (this.formData?.get("image")) { // @ts-ignore
            this.apiService.storeImage(
                this.formData?.get("image"),
                `images/communities/${communityID}/${eventID}`
            ).subscribe({
                next: () => {
                    this.apiService.updateEventImage(
                        `images/communities/${communityID}/${eventID}`,
                        communityID,
                        eventID
                    ).subscribe();
                },
                error: () => Swal.fire({
                    title: "Error!",
                    text: "We could not upload your event image!",
                    icon: "error",
                    confirmButtonText: "Continue"
                })
            });
        }
    }

    private parseDate(date: string, time: string): Date {
        return new Date(Date.parse(`${date}T${time}`));
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFile(file: File) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.uploadedImage = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, sube solo una imagen.");
        }
    }

    ngOnInit() {
        this.formData = this.formService.get("event") as FormService;
        this.uploadedImage = this.formData.getOrDefault("image", null);
        this.eventDescription = this.formData.getOrDefault("description", "");
    }

    protected saveFormData() {
        this.formData!.put("image", this.uploadedImage);
        this.formData!.put("description", this.eventDescription);
        this.formService.update();
    }
}
