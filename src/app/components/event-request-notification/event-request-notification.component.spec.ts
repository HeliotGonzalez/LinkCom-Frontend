import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRequestNotificationComponent } from './event-request-notification.component';

describe('EventRequestNotificationComponent', () => {
  let component: EventRequestNotificationComponent;
  let fixture: ComponentFixture<EventRequestNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventRequestNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventRequestNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
