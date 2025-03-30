import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstStepEventCreationComponent } from './first-step-event-creation.component';

describe('FirstStepEventCreationComponent', () => {
  let component: FirstStepEventCreationComponent;
  let fixture: ComponentFixture<FirstStepEventCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstStepEventCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstStepEventCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
