import {Component, Input} from '@angular/core';
import {FormStepsComponent} from "../../../form-steps/form-steps.component";
import {Router} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {CommunityFormService} from "../../../../services/community-form-service/community-form.service";

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
    protected uploadedImage: string | null = null;

    constructor(private router: Router, private communityFormService: CommunityFormService) {
    }

    previousPage() {
        this.router.navigate(["/secondStepCommunityCreation"]).then(r => {});
        this.saveFormData();
    }

    nextPage() {
        this.router.navigate(["/"]).then(r => {});
        this.saveFormData();
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
                this.uploadedImage = e.target?.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, sube solo una imagen.");
        }
    }

    private saveFormData() {
        this.communityFormService.put("uploadedImage", this.uploadedImage);
        this.communityFormService.update();
    }

    ngOnInit() {
        this.communityFormService.data$.subscribe(data => {
            this.uploadedImage = data["uploadedImage"];
        });
    }
}
