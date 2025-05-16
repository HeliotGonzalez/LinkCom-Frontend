import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRequestsPanelComponent } from './friend-requests-panel.component';

describe('FriendRequestsPanelComponent', () => {
  let component: FriendRequestsPanelComponent;
  let fixture: ComponentFixture<FriendRequestsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendRequestsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendRequestsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
