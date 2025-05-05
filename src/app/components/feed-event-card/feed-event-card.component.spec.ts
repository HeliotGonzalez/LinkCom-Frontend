import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedEventCardComponent } from './feed-event-card.component';

describe('FeedEventCardComponent', () => {
  let component: FeedEventCardComponent;
  let fixture: ComponentFixture<FeedEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedEventCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
