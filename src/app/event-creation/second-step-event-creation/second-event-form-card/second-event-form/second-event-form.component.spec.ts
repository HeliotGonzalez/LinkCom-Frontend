import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondEventFormComponent } from './second-event-form.component';

describe('SecondEventFormComponent', () => {
  let component: SecondEventFormComponent;
  let fixture: ComponentFixture<SecondEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondEventFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
