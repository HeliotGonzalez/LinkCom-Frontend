import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsRequestPanelComponent } from './events-request-panel.component';

describe('EventsRequestPanelComponent', () => {
  let component: EventsRequestPanelComponent;
  let fixture: ComponentFixture<EventsRequestPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsRequestPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsRequestPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
