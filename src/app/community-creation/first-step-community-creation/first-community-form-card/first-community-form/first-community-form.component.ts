import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {FormStepsComponent} from '../../../../form-steps/form-steps.component';
import {Router} from '@angular/router';
import {FormService} from "../../../../services/form-service/form.service";
import {FormsModule} from "@angular/forms";
import {InterestTagComponent} from '../../../../interest-tag/interest-tag.component';
import {NgForOf, NgIf} from '@angular/common';
import {ApiService} from "../../../../services/api-service.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-first-community-form',
    imports: [
        FormStepsComponent,
        FormsModule,
        InterestTagComponent,
        NgForOf,
        NgIf
    ],
    templateUrl: './first-community-form.component.html',
    standalone: true,
    styleUrl: './first-community-form.component.css'
})
export class FirstCommunityFormComponent {
    @ViewChild("tagNameInput") tagNameInput!: ElementRef;

    protected name: string = "";
    protected newTag: string = "";
    protected interests: string[] = [];
    protected storedInterests: string[] = [];
    protected interestsCoincidences: string[] = [];

    constructor(private router: Router, private communityFormService: FormService, private apiService: ApiService) {
    }

    nextPage(event: Event) {
        if (this.name === "") {
            Swal.fire("Error!", "All required fields must be filled!", "error");
            return;
        }
        event.preventDefault();
        this.saveFormData();
        this.router.navigate(["/secondStepCommunityCreation"]).then(r => {
        });
    }

    protected saveFormData() {
        this.communityFormService.put("communityName", this.name);
        this.communityFormService.put("communityInterests", this.interests);
        this.communityFormService.update();
    }

    ngOnInit() {
        this.communityFormService.data$.subscribe(data => {
            this.name = data["communityName"] ? data["communityName"] : "";
            this.interests = data["communityInterests"] ? data["communityInterests"] : [];
        });
        this.apiService.getInterests().subscribe(res => {
            // @ts-ignore
            this.storedInterests = this.storedInterests.concat(res["data"].map(e => e["name"]));
        });
    }

    addInterestTag(event: Event, value: string) {
        event.preventDefault();
        if (!this.storedInterests.includes(value)) {
            Swal.fire("Error!", "Interest not found!", "error");
            return;
        }
        let normalizedValue = `#${value}`.toLowerCase();
        if (!(this.interests.includes(normalizedValue))) this.interests = [...this.interests, normalizedValue];
        this.newTag = "";
    }

    removeInterest(interestName: string) {
        this.interests = this.interests.filter(i => i !== interestName);
    }

    getCoincidences(event: Event, value: string) {
        this.interestsCoincidences = this.storedInterests.filter(i => value !== '' && i.startsWith(value)).filter(i => !this.interests.includes(`#${i}`.toLowerCase()));
    }

    moveFocus(event: Event, tagNameInput: HTMLInputElement) {
        event.preventDefault();
        tagNameInput.focus();
    }

    addInterestTagFromCoincidence($event: MouseEvent, interest: string) {
        this.interestsCoincidences = this.interestsCoincidences.filter(i => i !== interest);
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
