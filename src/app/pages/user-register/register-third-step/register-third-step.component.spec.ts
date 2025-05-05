import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterThirdStepComponent } from './register-third-step.component';

describe('RegisterThirdStepComponent', () => {
  let component: RegisterThirdStepComponent;
  let fixture: ComponentFixture<RegisterThirdStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterThirdStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterThirdStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
