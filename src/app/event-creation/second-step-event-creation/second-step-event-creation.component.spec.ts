import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondStepEventCreationComponent } from './second-step-event-creation.component';

describe('SecondStepEventCreationComponent', () => {
  let component: SecondStepEventCreationComponent;
  let fixture: ComponentFixture<SecondStepEventCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondStepEventCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondStepEventCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
