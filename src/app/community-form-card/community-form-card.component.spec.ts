import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityFormCardComponent } from './community-form-card.component';

describe('CommunityFormCardComponent', () => {
  let component: CommunityFormCardComponent;
  let fixture: ComponentFixture<CommunityFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityFormCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
