/**
 * @jest-environment node
 */

import * as  fs from 'fs';
import { FeatureToggleClientService } from '../src/FeatureToggleClientService';

let authorizationToken;
let secret;

if(fs.existsSync('secret.ts')) {
  secret = require('../secret.ts'); //tslint:disable-line
}

authorizationToken = secret ? secret.apiAuthorizationToken : process.env.LAUNCH_DARKLY_API_AUTHORIZATION_TOKEN;

describe('API', () => {
  test('Should initialize API Service', async () => {
    const instance = FeatureToggleClientService.getInstance();

    instance.initializeApiService( { projectKey: 'default', environmentKey: 'dev', authorizationToken: authorizationToken } );
    expect(instance.getApiServiceInstance()).toBeTruthy();
  });

  xtest('Should insert a user to a feature toggle', async () => {
    const instance = FeatureToggleClientService.getInstance();

    instance.initializeApiService( { projectKey: 'default', environmentKey: 'dev', authorizationToken: authorizationToken } );
    const success = await instance.addUserToFeatureToggle( { email: 'user@email.com' } , 'action-with-condition');
    expect(success).toBeTruthy();
  });

  xtest('Should insert users to a feature toggle', async () => {
    const instance = FeatureToggleClientService.getInstance();

    instance.initializeApiService( { projectKey: 'default', environmentKey: 'dev', authorizationToken: authorizationToken } );
    const success = await instance.addUsersToFeatureToggle(
      [{ email: 'user1@email.com' } , { email: 'user2@email.com' }] ,
       'action-with-condition');
    expect(success).toBeTruthy();
  });
});
