import * as index from '../src/index';

test('Should have module available', () => {
  expect(index.FeatureToggleClientService).toBeTruthy();
});
