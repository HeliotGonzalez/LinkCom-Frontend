import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondCommunityFormComponent } from './second-community-form.component';

describe('SecondCommunityFormComponent', () => {
  let component: SecondCommunityFormComponent;
  let fixture: ComponentFixture<SecondCommunityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondCommunityFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondCommunityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
