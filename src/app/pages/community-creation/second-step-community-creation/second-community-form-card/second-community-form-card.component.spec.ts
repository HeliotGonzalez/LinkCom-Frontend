import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondCommunityFormCardComponent } from './second-community-form-card.component';

describe('SecondCommunityFormCardComponent', () => {
  let component: SecondCommunityFormCardComponent;
  let fixture: ComponentFixture<SecondCommunityFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondCommunityFormCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondCommunityFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
