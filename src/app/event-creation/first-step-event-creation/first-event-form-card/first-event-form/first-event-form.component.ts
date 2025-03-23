import {Component} from '@angular/core';
import {FormStepsComponent} from '../../../../community-creation/form-steps/form-steps.component';
import {Router} from "@angular/router";

@Component({
    selector: 'app-first-event-form',
    imports: [
        FormStepsComponent
    ],
    templateUrl: './first-event-form.component.html',
    styleUrl: './first-event-form.component.css'
})
export class FirstEventFormComponent {

    constructor(private router: Router) {
    }

    nextPage() {
        this.router.navigate(["/secondStepEventCreation"]).then(r => {});
    }
}
