import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstCommunityFormComponent } from './first-community-form.component';

describe('FirstCommunityFormComponent', () => {
  let component: FirstCommunityFormComponent;
  let fixture: ComponentFixture<FirstCommunityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstCommunityFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstCommunityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
