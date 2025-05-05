import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorsManagementComponent } from './moderators-management.component';

describe('ModeratorsManagementComponent', () => {
  let component: ModeratorsManagementComponent;
  let fixture: ComponentFixture<ModeratorsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
