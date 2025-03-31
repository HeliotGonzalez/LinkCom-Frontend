import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondStepCommunityCreationComponent } from './second-step-community-creation.component';

describe('SecondStepCommunityCreationComponent', () => {
  let component: SecondStepCommunityCreationComponent;
  let fixture: ComponentFixture<SecondStepCommunityCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondStepCommunityCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondStepCommunityCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
