import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstStepCommunityCreationComponent } from './first-step-community-creation.component';

describe('FirstStepCommunityCreationComponent', () => {
  let component: FirstStepCommunityCreationComponent;
  let fixture: ComponentFixture<FirstStepCommunityCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstStepCommunityCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstStepCommunityCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
