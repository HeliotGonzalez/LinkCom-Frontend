import {Component} from '@angular/core';
import {FormStepsComponent} from "../../../../../components/form-steps/form-steps.component";
import {getLocaleFirstDayOfWeek, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {FormService} from '../../../../../services/form-service/form.service';
import {FormsModule} from '@angular/forms';
import {AuthService} from "../../../../../services/auth.service";
import {ServiceFactory} from "../../../../../services/api-services/ServiceFactory.service";
import {Notify} from "../../../../../services/notify";
import {EventState} from "../../../../../../architecture/model/EventState";
import {marked} from "marked";
import {CreateEventCommand} from "../../../../../commands/CreateEventCommand";
import {first, firstValueFrom} from "rxjs";
import {CommunityService} from "../../../../../../architecture/services/CommunityService";

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
        CreateEventCommand.Builder.create().withFactory(this.serviceFactory).withEvent(await this.buildEvent()).build().execute();
        this.formService.remove('event');
    }

    private parseDate(date: string, time: string): string {
        return new Date(Date.parse(`${date}T${time}`)).toISOString();
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

    private async buildEvent() {
        return {
            title: this.formData?.get("name"),
            description: await marked(this.formData?.get("description")),
            date: this.parseDate(this.formData?.get("date"), this.formData?.get("time")),
            location: this.formData?.get("location"),
            creatorID: this.authService.getUserUUID(),
            communityID: this.formData?.get("communityID"),
            imagePath: this.formData?.get("image"),
            eventState: await this.canCreateEvent() ? EventState.PUBLISHED : EventState.PENDING
        }
    }

    private async canCreateEvent() {
        const community = (await firstValueFrom((this.serviceFactory.get('communities') as CommunityService).getCommunity(this.formData?.get('communityID')))).data[0];
        const isModerator = (
            await firstValueFrom(
                (this.serviceFactory.get('communities') as CommunityService)
                    .isUserModerator(this.formData?.get('communityID'), this.authService.getUserUUID())
            )
        ).data.length > 0;
        console.log(isModerator);
        console.log(community);
        console.log(this.authService.getUserUUID())
        console.log(community.creatorID)
        return this.authService.getUserUUID() === community.creatorID || isModerator;
    }
}
