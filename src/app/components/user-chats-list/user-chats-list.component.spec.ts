import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChatsListComponent } from './user-chats-list.component';

describe('UserChatsListComponent', () => {
  let component: UserChatsListComponent;
  let fixture: ComponentFixture<UserChatsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChatsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
