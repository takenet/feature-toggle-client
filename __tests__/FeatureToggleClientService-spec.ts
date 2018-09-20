import { FeatureToggleClientService } from '../src/FeatureToggleClientService';
import { UserAccount } from '../src/types/UserAccount';
import { Application } from '../src/types/Application';
import fs from 'fs';

let exampleHmgKey;
let secret;

if(fs.existsSync('./secret.ts')) {
  secret = require('./secret'); //tslint:disable-line
}

exampleHmgKey = secret.secrectKey || process.env.LAUNCH_DARKLY_KEY;

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

describe('Feature', () => {
  test('Should check for a application feature', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const application = new Application({
      name: 'Application name',
      shortName: 'applicationShortName',
      template: 'builder'
    });

    instance.initializeApplication(application, exampleHmgKey);
    const isApplicationFeatureEnabled = await instance.isApplicationFeatureEnabled('feature-test');
    expect(isApplicationFeatureEnabled).toBeDefined();
  });

  test('Should check for a user feature', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const user = new UserAccount({
      email: 'samuels@take.net',
      fullName: 'Samuel Martins',
    });

    instance.initializeUser(user, exampleHmgKey);
    const isUserFeatureEnabled = await instance.isUserFeatureEnabled('feature-test');
    expect(isUserFeatureEnabled).toBeDefined();
  });

  test('Should check for user or application instance feature', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const application = new Application({
      name: 'Application name',
      shortName: 'applicationShortName',
      template: 'builder'
    });
    instance.initializeApplication(application, exampleHmgKey);

    const user = new UserAccount({
      email: 'samuels@take.net',
      fullName: 'Samuel Martins',
    });
    instance.initializeUser(user, exampleHmgKey);

    const isFeatureEnabled = await instance.isApplicationFeatureEnabled('feature-test');
    expect(isFeatureEnabled).toBeDefined();
  });
});

