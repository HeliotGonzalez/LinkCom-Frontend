import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityRequestComponent } from './community-request.component';

describe('CommunityRequestComponent', () => {
  let component: CommunityRequestComponent;
  let fixture: ComponentFixture<CommunityRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
