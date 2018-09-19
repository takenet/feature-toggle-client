import { FeatureToggleClientService } from '../src/FeatureToggleClientService';

test('Should get a FeatureToggleClientService instance', () => {
  const instance = FeatureToggleClientService.getInstance();
  expect(instance).toBeTruthy();
});
