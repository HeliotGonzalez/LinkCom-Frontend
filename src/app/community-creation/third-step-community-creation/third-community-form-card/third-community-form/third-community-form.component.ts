import {Component} from '@angular/core';
import {FormStepsComponent} from "../../../../form-steps/form-steps.component";
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {FormService} from "../../../../services/form-service/form.service";
import {ApiService} from "../../../../services/api-service.service";
import Swal from "sweetalert2";
import {AuthService} from "../../../../services/auth.service";

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
        private apiService: ApiService,
        private authService: AuthService) {
    }

    protected previousPage() {
        this.router.navigate(["/secondStepCommunityCreation"]).then(r => {
        });
        this.saveFormData();
    }

    protected async nextPage(event: Event) {
        event.preventDefault();

        this.saveFormData();

        this.apiService.createCommunity(
            { userID: this.authService.getUserUUID(),
                description: this.formData?.get("description"),
                name: this.formData?.get("name"),
                isPrivate: this.formData?.get("privacy"),
                img: this.formData?.get("image"),
                communityInterests: this.formData?.get("interests") }
        ).subscribe({
            next: res => {
                Swal.fire({
                    title: "Success!",
                    text: "Your community has been correctly created!",
                    icon: "success",
                    confirmButtonText: "Continue"
                });
                if (this.formData?.get("image")) { // @ts-ignore
                    this.apiService.saveImage(this.formData?.get("image"), res['data']['communityID']);
                }
                this.formService.remove("community");
            },
            error: err => Swal.fire({
                title: "Error!",
                text: "We could not create your community.",
                icon: "error",
                confirmButtonText: "Continue"
            })
        });
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
        console.log(this.formData)
        this.uploadedImage = this.formData.getOrDefault("image", null);
    }
}
