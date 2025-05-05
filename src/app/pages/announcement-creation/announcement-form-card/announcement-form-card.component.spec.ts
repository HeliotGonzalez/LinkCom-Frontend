import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementFormCardComponent } from './announcement-form-card.component';

describe('AnnouncementFormCardComponent', () => {
  let component: AnnouncementFormCardComponent;
  let fixture: ComponentFixture<AnnouncementFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementFormCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
