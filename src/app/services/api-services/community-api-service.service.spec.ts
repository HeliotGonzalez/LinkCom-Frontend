import { TestBed } from '@angular/core/testing';

import { HTTPCommunityService } from './h-t-t-p-community.service';

describe('CommunityApiServiceService', () => {
  let service: HTTPCommunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HTTPCommunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
