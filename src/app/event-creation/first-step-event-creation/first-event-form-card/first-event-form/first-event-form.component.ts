import {Component} from '@angular/core';
import {FormStepsComponent} from '../../../../community-creation/form-steps/form-steps.component';
import {Router} from "@angular/router";
import {CommunityFormService} from '../../../../services/community-form-service/community-form.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-first-event-form',
  imports: [
    FormStepsComponent,
    FormsModule
  ],
  templateUrl: './first-event-form.component.html',
  standalone: true,
  styleUrl: './first-event-form.component.css'
})
export class FirstEventFormComponent {
  protected eventName: string | null = "Test event";
  protected eventDate: string | null = "2025-03-21";
  protected eventTime: string | null = "15:36";
  protected eventLocation: string | null = "My house";

  constructor(private router: Router, private formService: CommunityFormService) {
  }

  nextPage() {
    this.router.navigate(["/secondStepEventCreation"]).then(r => {
    });
    this.saveFormData();
  }

  private saveFormData() {
    this.formService.put("eventName", this.eventName);
    this.formService.put("eventDate", this.eventDate);
    this.formService.put("eventTime", this.eventTime);
    this.formService.put("eventLocation", this.eventLocation);
    this.formService.update();
  }

  ngOnInit() {
    this.eventName = this.formService.get("eventName");
    this.eventDate = this.formService.get("eventDate");
    this.eventTime = this.formService.get("eventTime");
    this.eventLocation = this.formService.get("eventLocation");
  }

  setFocus(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    input.focus();

  }
}
