import {Component, HostListener} from '@angular/core';
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
import { LanguageService } from '../../../../../language.service';
import { InterestTagComponent } from "../../../../../components/interest-tag/interest-tag.component";
import Swal from 'sweetalert2';
import { ApiService } from '../../../../../services/api-service.service';

@Component({
    selector: 'app-second-event-form',
    imports: [
    FormStepsComponent,
    NgIf,
    FormsModule,
    InterestTagComponent
],
    templateUrl: './second-event-form.component.html',
    standalone: true,
    styleUrl: './second-event-form.component.css'
})
export class SecondEventFormComponent {
    protected formData: FormService | null = null;
    protected uploadedImage: string | null = null;
    protected eventDescription: string = "";
    protected newTag: string = "";
    protected interests: string[] = [];
    protected storedInterests: string[] = [];
    protected interestsCoincidences: string[] = [];

    constructor(
        private router: Router,
        private formService: FormService,
        private serviceFactory: ServiceFactory,
        private authService: AuthService,
        private notify: Notify,
        private languageService: LanguageService,
        private apiService: ApiService
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
            let text = (this.languageService.current == 'en') ? "All required fields must be filled!" : "Todos los campos obligatorios deben ser introducidos";
            this.notify.error(text);
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
        this.interests = this.formData.getOrDefault("interests", "");
        this.apiService.getInterests().subscribe(res => {
            // @ts-ignore
            this.storedInterests = [...res].map(e => e["name"]);
        });
        
    }

    protected saveFormData() {
        this.formData!.put("image", this.uploadedImage);
        this.formData!.put("description", this.eventDescription);
        this.formData!.put("interests", this.interests);
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
            eventState: await this.canCreateEvent() ? EventState.PUBLISHED : EventState.PENDING,
            slots: this.formData?.get("slots"),
            interests: this.formData?.get("interests")
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

    getCoincidences(event: Event, value: string) {
        this.interestsCoincidences = this.storedInterests.filter(i => value !== '' && i.toLowerCase().includes(value.toLowerCase())).filter(i => !this.interests.includes(i.toLowerCase()));
    }

    addInterestTag(event: Event, value: string) {
        event.preventDefault();
        if (!this.storedInterests.find(i => i.toLowerCase() === value.toLowerCase())) {
            if (this.languageService.current == 'en'){
                Swal.fire("Error!", "Interest not found!", "error");
            } else {
                Swal.fire("¡Error!", "Interés no encontrado", "error");
            }
            return;
        }
        if (!this.interests.includes(value.toLowerCase())) this.interests = [...this.interests, value];
        this.newTag = "";
    }

    removeInterest(interestName: string) {
        this.interests = this.interests.filter(i => i.toLowerCase() !== interestName.toLowerCase());
    }

    addInterestTagFromCoincidence($event: MouseEvent, interest: string) {
        this.interestsCoincidences = this.interestsCoincidences.filter(i => i.toLowerCase() !== interest.toLowerCase());
        this.addInterestTag($event, interest);
    }

    @HostListener('document:click', ['$event'])
        clickOutside(event: MouseEvent) {
            // @ts-ignore
            if (!this.tagNameInput.nativeElement.contains(event.target) && event.target.className !== "interest-suggestion-item") {
                this.interestsCoincidences = [];
            }
        }
}
