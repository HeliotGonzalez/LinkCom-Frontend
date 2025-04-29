import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdCommunityFormCardComponent } from './third-community-form-card.component';

describe('ThirdCommunityFormCardComponent', () => {
  let component: ThirdCommunityFormCardComponent;
  let fixture: ComponentFixture<ThirdCommunityFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdCommunityFormCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdCommunityFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
