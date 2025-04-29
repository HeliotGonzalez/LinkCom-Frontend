import { TestBed } from '@angular/core/testing';

import { EntitiesIdService } from './entities-id.service';

describe('EntitiesIdService', () => {
  let service: EntitiesIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntitiesIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
