import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormStepsComponent} from '../../../../form-steps/form-steps.component';
import {Router} from '@angular/router';
import {FormService} from "../../../../services/form-service/form.service";
import {FormsModule} from "@angular/forms";
import {InterestTagComponent} from '../../../../interest-tag/interest-tag.component';
import {NgForOf} from '@angular/common';
import {ApiService} from "../../../../services/api-service.service";

@Component({
    selector: 'app-first-community-form',
    imports: [
        FormStepsComponent,
        FormsModule,
        InterestTagComponent,
        NgForOf
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

    constructor(private router: Router, private communityFormService: FormService, private apiService: ApiService) {
    }

    nextPage(event: Event) {
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
    }

    addInterestTag(event: Event, value: string) {
        event.preventDefault();
        let normalizedValue = `#${value}`.toLowerCase();
        if (!(this.interests.includes(normalizedValue))) this.interests = [...this.interests, normalizedValue];
        this.newTag = "";
    }

    removeInterest(interestName: string) {
        this.interests = this.interests.filter(i => i !== interestName);
    }

    moveFocus(event: Event, tagNameInput: HTMLInputElement) {
        event.preventDefault();
        tagNameInput.focus();
    }
}
