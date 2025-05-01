import { TestBed } from '@angular/core/testing';

import { CommandBuilderFactory } from './command-builder-factory.service';

describe('CommandbuilderfactoryService', () => {
  let service: CommandBuilderFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandBuilderFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
