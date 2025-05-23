import {Component} from '@angular/core';
import {FormStepsComponent} from "../../../../../components/form-steps/form-steps.component";
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {FormService} from "../../../../../services/form-service/form.service";
import {AuthService} from "../../../../../services/auth.service";
import {ServiceFactory} from "../../../../../services/api-services/ServiceFactory.service";
import {CommunityService} from "../../../../../../architecture/services/CommunityService";
import {Community} from "../../../../../../architecture/model/Community";
import {Notify} from "../../../../../services/notify";
import {marked} from "marked";
import {CreateCommunityCommand} from "../../../../../commands/CreateCommunityCommand";

@Component({
    selector: 'app-third-community-form',
    imports: [
        FormStepsComponent,
        NgIf
    ],
    templateUrl: './third-community-form.component.html',
    standalone: true,
    styleUrl: './third-community-form.component.css'
})
export class ThirdCommunityFormComponent {
    protected formData: FormService | null = null;
    protected uploadedImage: string | null = null;

    constructor(private router: Router,
                private formService: FormService,
                private serviceFactory: ServiceFactory,
                private authService: AuthService,
                private notify: Notify
    ) {
    }

    protected previousPage() {
        this.router.navigate(["/secondStepCommunityCreation"]).then(r => {
        });
        this.saveFormData();
    }

    protected async nextPage(event: Event) {
        event.preventDefault();
        this.saveFormData();
        CreateCommunityCommand.Builder.create().withFactory(this.serviceFactory).withCommunity(await this.buildCommunity()).build().execute();
    }

    private async buildCommunity() {
        return {
            creatorID: this.authService.getUserUUID(),
            description: await marked(this.formData?.get("description")),
            name: this.formData?.get("name"),
            isPrivate: this.formData?.get("privacy"),
            imagePath: this.formData?.get("image"),
            interests: this.formData?.get("interests")
        };
    }

    protected onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    protected onDrop(event: DragEvent) {
        event.preventDefault();

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    protected handleFile(file: File) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.uploadedImage = e.target?.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, sube solo una imagen.");
        }
    }

    protected saveFormData() {
        this.formData!.put("image", this.uploadedImage);
        this.formService.update();
    }

    ngOnInit() {
        this.formData = this.formService.get("community") as FormService;
        this.uploadedImage = this.formData.getOrDefault("image", null);
    }

    changeFormStep(route: string) {
        this.saveFormData();
        this.router.navigate([route]).then(r => {
        });
    }
}
