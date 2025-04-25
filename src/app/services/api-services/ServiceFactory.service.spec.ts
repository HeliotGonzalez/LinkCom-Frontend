import { TestBed } from '@angular/core/testing';

import { ServiceFactory } from './ServiceFactory.service';

describe('ServiceFactoryService', () => {
  let service: ServiceFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
