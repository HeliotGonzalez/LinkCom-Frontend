import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityViewComponent } from './community-view.component';

describe('CommunityViewComponent', () => {
  let component: CommunityViewComponent;
  let fixture: ComponentFixture<CommunityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
