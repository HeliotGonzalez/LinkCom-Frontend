import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementTableComponent } from './announcement-table.component';

describe('AnnouncementTableComponent', () => {
  let component: AnnouncementTableComponent;
  let fixture: ComponentFixture<AnnouncementTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
