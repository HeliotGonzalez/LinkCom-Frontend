import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdCommunityFormComponent } from './third-community-form.component';

describe('ThirdCommunityFormComponent', () => {
  let component: ThirdCommunityFormComponent;
  let fixture: ComponentFixture<ThirdCommunityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdCommunityFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdCommunityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
