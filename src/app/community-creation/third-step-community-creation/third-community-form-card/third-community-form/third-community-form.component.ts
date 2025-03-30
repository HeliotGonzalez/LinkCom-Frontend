import {Component, Input} from '@angular/core';
import {FormStepsComponent} from "../../../../form-steps/form-steps.component";
import {Router} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {FormService} from "../../../../services/form-service/form.service";
import {ApiService} from "../../../../services/api-service.service";
import {firstValueFrom} from "rxjs";
import Swal from "sweetalert2";

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

    constructor(private router: Router, private formService: FormService, private apiService: ApiService) {
    }

    previousPage() {
        this.router.navigate(["/secondStepCommunityCreation"]).then(r => {});
        this.saveFormData();
    }

    async nextPage(event: Event) {
        event.preventDefault();

        const data = await firstValueFrom(this.formService.data$);

        this.apiService.createCommunity(
            "550e8400-e29b-41d4-a716-446655440000",
            data["communityDescription"],
            data["communityName"],
            data["communityPrivacy"],
            data["communityInterests"]
        ).subscribe({
            next: res => Swal.fire({
                title: "Success!",
                text: "Your community has been correctly created!",
                icon: "success",
                confirmButtonText: "Continue"
            }),
            error: err => Swal.fire({
                title: "Error!",
                text: "We could not create your community.",
                icon: "error",
                confirmButtonText: "Continue"
            })
        });
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

    protected saveFormData() {
        this.formService.put("communityUploadedImage", this.uploadedImage);
        this.formService.update();
    }

    ngOnInit() {
        this.formService.data$.subscribe(data => {
            this.uploadedImage = data["communityUploadedImage"];
        });
    }
}
