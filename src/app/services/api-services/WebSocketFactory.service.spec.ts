import { TestBed } from '@angular/core/testing';

import { WebSocketFactory } from './WebSocketFactory.service';

describe('WebSocketFactoryService', () => {
  let service: WebSocketFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
