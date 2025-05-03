import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstEventFormCardComponent } from './first-event-form-card.component';

describe('FirstEventFormCardComponent', () => {
  let component: FirstEventFormCardComponent;
  let fixture: ComponentFixture<FirstEventFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstEventFormCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstEventFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
