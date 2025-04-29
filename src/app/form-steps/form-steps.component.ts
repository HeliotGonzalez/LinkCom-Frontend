import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-form-steps',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './form-steps.component.html',
  standalone: true,
  styleUrl: './form-steps.component.css'
})
export class FormStepsComponent {
  @Input() steps: { step: number; route: string }[] = [];
  @Input() currentStep: number = 1;
  @Output() saveDataEmitter = new EventEmitter<string>();

  getStepClass(step: number) {
    return this.currentStep === step ? 'focused-step' : this.currentStep > step ? 'previous-step' : 'non-focused-step';
  }

  emit(route: string) {
    this.saveDataEmitter.emit(route);
  }
}
