import { TestBed } from '@angular/core/testing';

import { Register } from './register.service';

describe('Register', () => {
  let service: Register;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Register);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
