import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSecondStepComponent } from './register-second-step.component';

describe('RegisterSecondStepComponent', () => {
  let component: RegisterSecondStepComponent;
  let fixture: ComponentFixture<RegisterSecondStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSecondStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSecondStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
