import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstCommunityFormCardComponent } from './first-community-form-card.component';

describe('CommunityFormCardComponent', () => {
  let component: FirstCommunityFormCardComponent;
  let fixture: ComponentFixture<FirstCommunityFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstCommunityFormCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstCommunityFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
