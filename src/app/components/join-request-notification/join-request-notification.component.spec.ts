import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRequestNotificationComponent } from './join-request-notification.component';

describe('JoinRequestNotificationComponent', () => {
  let component: JoinRequestNotificationComponent;
  let fixture: ComponentFixture<JoinRequestNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinRequestNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinRequestNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
