import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsModdalComponent } from './reports-moddal.component';

describe('ReportsModdalComponent', () => {
  let component: ReportsModdalComponent;
  let fixture: ComponentFixture<ReportsModdalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsModdalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsModdalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
