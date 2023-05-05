import { TestBed } from '@angular/core/testing';

import { MainFacilityService } from './main-facility.service';

describe('MainFacilityService', () => {
  let service: MainFacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainFacilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
