import { TestBed } from '@angular/core/testing';

import { NgxWindowService } from './ngx-window.service';

describe('NgxWindowService', () => {
  let service: NgxWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
