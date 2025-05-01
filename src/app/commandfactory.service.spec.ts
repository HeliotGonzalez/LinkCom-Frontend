import { TestBed } from '@angular/core/testing';

import { CommandfactoryService } from './commandfactory.service';

describe('CommandfactoryService', () => {
  let service: CommandfactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandfactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
