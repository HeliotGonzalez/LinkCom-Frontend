import { TestBed } from '@angular/core/testing';

import { CommunityFormService } from './community-form.service';

describe('CommunityFormService', () => {
  let service: CommunityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
