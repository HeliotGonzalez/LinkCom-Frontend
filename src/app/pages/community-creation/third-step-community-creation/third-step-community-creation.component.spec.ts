import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdStepCommunityCreationComponent } from './third-step-community-creation.component';

describe('ThirdStepCommunityCreationComponent', () => {
  let component: ThirdStepCommunityCreationComponent;
  let fixture: ComponentFixture<ThirdStepCommunityCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdStepCommunityCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdStepCommunityCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
