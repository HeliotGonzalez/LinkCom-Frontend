import {Component} from '@angular/core';
import {FormStepsComponent} from "../../../../form-steps/form-steps.component";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {FormService} from '../../../../services/form-service/form.service';
import {FormsModule} from '@angular/forms';
import {ApiService} from "../../../../services/api-service.service";
import Swal from "sweetalert2";
import {AuthService} from "../../../../services/auth.service";
import {ServiceFactory} from "../../../../services/api-services/ServiceFactory.service";
import {EventService} from "../../../../../architecture/services/EventService";
import {CommunityEvent} from "../../../../../architecture/model/CommunityEvent";
import {Notify} from "../../../../services/notify";
import {CreateEventCommand} from "../../../../commands/CreateEventCommand";

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
        private serviceFactory: ServiceFactory,
        private apiService: ApiService,
        private authService: AuthService,
        private notify: Notify
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
            this.notify.error("All required fields must be filled!");
            return;
        }
        CreateEventCommand.Builder.create().withFactory(this.serviceFactory).withEvent(this.buildEvent()).build().execute();
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

    private buildEvent() {
        return {
            title: this.formData?.get("name"),
            description: this.formData?.get("description"),
            date: this.parseDate(this.formData?.get("date"), this.formData?.get("time")),
            location: this.formData?.get("location"),
            creatorID: this.authService.getUserUUID(),
            communityID: this.formData?.get("communityID"),
            imagePath: this.formData?.get("image")
        }
    }
}
