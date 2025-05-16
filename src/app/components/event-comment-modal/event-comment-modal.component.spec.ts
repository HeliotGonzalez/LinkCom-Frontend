import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCommentModalComponent } from './event-comment-modal.component';

describe('EventCommentModalComponent', () => {
  let component: EventCommentModalComponent;
  let fixture: ComponentFixture<EventCommentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCommentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
