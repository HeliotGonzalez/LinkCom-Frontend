import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondEventFormCardComponent } from './second-event-form-card.component';

describe('SecondEventFormCardComponent', () => {
  let component: SecondEventFormCardComponent;
  let fixture: ComponentFixture<SecondEventFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondEventFormCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondEventFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
