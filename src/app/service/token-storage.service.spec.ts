import { TestBed } from '@angular/core/testing';

import { TokenStorage } from './token-storage.service';

describe('TokenStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenStorage = TestBed.get(TokenStorage);
    expect(service).toBeTruthy();
  });
});
