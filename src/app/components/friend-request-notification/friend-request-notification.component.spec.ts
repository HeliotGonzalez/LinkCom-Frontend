import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRequestNotificationComponent } from './friend-request-notification.component';

describe('FriendRequestNotificationComponent', () => {
  let component: FriendRequestNotificationComponent;
  let fixture: ComponentFixture<FriendRequestNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendRequestNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendRequestNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
