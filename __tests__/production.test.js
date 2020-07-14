'use strict';

import {ENV} from './../src/constants/Config';

describe('Check production', () => {
  test('Environment', () => {
    expect(ENV).toBe('prod');
  });
});