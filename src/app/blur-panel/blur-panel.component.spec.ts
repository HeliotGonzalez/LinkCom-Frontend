import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlurPanelComponent } from './blur-panel.component';

describe('BlurPanelComponent', () => {
  let component: BlurPanelComponent;
  let fixture: ComponentFixture<BlurPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlurPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlurPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
