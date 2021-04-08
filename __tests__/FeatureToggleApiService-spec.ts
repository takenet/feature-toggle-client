/**
 * @jest-environment node
 */

import { UserAccount } from '../src/types/UserAccount';
import * as  fs from 'fs';
import { FeatureToggleClientService } from '../src/FeatureToggleClientService';

let authorizationToken;
let secret;

if(fs.existsSync('secret.ts')) {
  secret = require('../secret.ts'); //tslint:disable-line
}

authorizationToken = secret ? secret.apiAuthorizationToken : process.env.LAUNCH_DARKLY_API_AUTHORIZATION_TOKEN;

describe('API', () => {
  test('Should insert a user to a feature toggle', async () => {
    const user = new UserAccount({
      email: 'mateus.almeida+1@take.net',
      fullName: 'Mateus Almeida',
    });
    const instance = FeatureToggleClientService.getInstance();

    instance.initializeApiService( { projectKey: 'default', environmentKey: 'dev', authorizationToken: authorizationToken } );
    const success = await instance.addUserToFeatureToggle(user, 'action-with-condition');
    expect(success).toBeTruthy();
  });
});
