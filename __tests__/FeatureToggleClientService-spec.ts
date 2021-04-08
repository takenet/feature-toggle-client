/**
 * @jest-environment node
 */

import { FeatureToggleClientService } from '../src/FeatureToggleClientService';
import { FeatureToggleService } from '../src/FeatureToggleService';
import { UserAccount } from '../src/types/UserAccount';
import { Application } from '../src/types/Application';
import * as mock from 'mock-fs'; //tslint:disable-line
import * as  fs from 'fs';

let exampleHmgKey;
let authorizationToken;
let secret;

if(fs.existsSync('secret.ts')) {
  secret = require('../secret.ts'); //tslint:disable-line
}

exampleHmgKey = secret ? secret.secrectKey : process.env.LAUNCH_DARKLY_KEY;
authorizationToken = secret ? secret.apiAuthorizationToken : process.env.LAUNCH_DARKLY_API_AUTHORIZATION_TOKEN;

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
  xtest('Should check for a application feature', async () => {
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

  xtest('Should check for a user feature', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const user = new UserAccount({
      email: 'user@email.com',
      fullName: 'Samuel Martins',
    });

    instance.initializeUser(user, exampleHmgKey);
    const isUserFeatureEnabled = await instance.isUserFeatureEnabled('feature-test');
    expect(isUserFeatureEnabled).toBeDefined();
  });

  xtest('Should check for user or application instance feature', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const application = new Application({
      name: 'Application name',
      shortName: 'applicationShortName',
      template: 'builder'
    });
    instance.initializeApplication(application, exampleHmgKey);

    const user = new UserAccount({
      email: 'user@email.com',
      fullName: 'Samuel Martins',
    });
    instance.initializeUser(user, exampleHmgKey);

    const isFeatureEnabled = await instance.isFeatureEnabled('feature-test');
    expect(isFeatureEnabled).toBeDefined();
  });

  test('Should return default value if default timeout has exceeded', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const defaultValue = false;
    const fakePromise = new Promise(resolve => {
      setTimeout(() => resolve(true), 6000);
    });

    const user = new UserAccount({
      email: 'user@email.com',
      fullName: 'Samuel Martins',
    });

    instance.initializeUser(user, exampleHmgKey);
    instance.setRequestTimeouts(2000);

    const resolvedValue = await (instance as any).solveRequestWithTimeout(fakePromise, defaultValue);
    expect(resolvedValue).toBeFalsy();
  });
});

describe('API', () => {
  test('Should insert a user to a feature toggle', async () => {
    const user = new UserAccount({
      email: 'mateus.almeida+1@take.net',
      fullName: 'Mateus Almeida',
    });
    const instance = FeatureToggleService.getInstance();

    instance.initializeService( { projectKey: 'default', environmentKey: 'dev', authorizationToken: authorizationToken } );
    const success = await instance.addUserToFeatureToggle(user, 'action-with-condition');
    expect(success).toBeTruthy();
  });
});
