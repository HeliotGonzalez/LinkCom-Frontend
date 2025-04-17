import { TestBed } from '@angular/core/testing';

import { Notify } from './notify';

describe('AlertServiceService', () => {
  let service: Notify;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Notify);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
