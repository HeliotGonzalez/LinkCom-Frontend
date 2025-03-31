import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstEventFormComponent } from './first-event-form.component';

describe('FirstEventFormComponent', () => {
  let component: FirstEventFormComponent;
  let fixture: ComponentFixture<FirstEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstEventFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
