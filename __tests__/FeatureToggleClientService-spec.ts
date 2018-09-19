import { FeatureToggleClientService } from '../src/FeatureToggleClientService';
import { UserAccount } from '../src/types/UserAccount';
import { Application } from '../src/types/Application';
const exampleHmgKey = '5b90099a64e7b415536ce16e';

test('Should get a FeatureToggleClientService instance', () => {
  const instance = FeatureToggleClientService.getInstance();
  expect(instance).toBeTruthy();
});

describe('Clients', () => {
  test('Should initialize an user instance', () => {
    const instance = FeatureToggleClientService.getInstance();
    const user = new UserAccount({
      address: 'My Address',
      email: 'user@email.com',
      fullName: 'User Full Name',
      id: 1,
      password: '1234',
      phoneNumber: '3333-3333',
    });

    instance.initializeUser(user, exampleHmgKey);
    expect(instance.getUserInstance()).toBeTruthy();
  });

  test('Should initialize an application instance', () => {
    const instance = FeatureToggleClientService.getInstance();
    const application = new Application({
      name: 'Application name',
      shortName: 'applicationShortName',
      template: 'builder'
    });

    instance.initializeApplication(application, exampleHmgKey);
    expect(instance.getApplicationInstance()).toBeTruthy();
  });

});

