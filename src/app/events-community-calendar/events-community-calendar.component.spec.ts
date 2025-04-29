import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsCommunityCalendarComponent } from './events-community-calendar.component';

describe('EventsCommunityCalendarComponent', () => {
  let component: EventsCommunityCalendarComponent;
  let fixture: ComponentFixture<EventsCommunityCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsCommunityCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsCommunityCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
