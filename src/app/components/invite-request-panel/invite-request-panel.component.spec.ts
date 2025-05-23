import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteRequestPanelComponent } from './invite-request-panel.component';

describe('InviteRequestPanelComponent', () => {
  let component: InviteRequestPanelComponent;
  let fixture: ComponentFixture<InviteRequestPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteRequestPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteRequestPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
