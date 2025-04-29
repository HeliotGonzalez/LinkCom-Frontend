import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestTagComponent } from './interest-tag.component';

describe('InterestTagComponent', () => {
  let component: InterestTagComponent;
  let fixture: ComponentFixture<InterestTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestTagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
