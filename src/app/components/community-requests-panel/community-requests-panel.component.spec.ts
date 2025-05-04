import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityRequestsPanelComponent } from './community-requests-panel.component';

describe('CommunityRequestsPanelComponent', () => {
  let component: CommunityRequestsPanelComponent;
  let fixture: ComponentFixture<CommunityRequestsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityRequestsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityRequestsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
