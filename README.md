[![Build Status](https://travis-ci.com/takenet/feature-toggle-client.svg?branch=master)](https://travis-ci.com/takenet/feature-toggle-client.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/takenet/feature-toggle-client/badge.svg?branch=master)](https://coveralls.io/github/takenet/feature-toggle-client?branch=master)
[![npm](https://img.shields.io/npm/v/feature-toggle-client.svg)](https://www.npmjs.com/package/feature-toggle-client)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Feature Toggle Client

## Usage

First, install client

```
npm i -S feature-toggle-client
```

Initialize user or application with a payload and LauchDarkly key.
You also can intialize the Launch Darkly API with an Authorization Token, Project Key and Environment Key.

```typescript
import { FeatureToggleClientService } from 'feature-toggle-client'

const init = () => {
  // Initialize user instance
  FeatureToggleClientService
    .initializeUser({
      fullName: 'My incredible name',
      email: 'user@email.com', // LauchDarkly user key
    }, 'YOUR-LAUNCH-DARKLY-KEY')

  // Initialize user application
  FeatureToggleClientService
    .initializeApplication({
      shortName: 'applicationShortName', // LauchDarkly user key
      name: 'Application name',
    }, 'YOUR-LAUNCH-DARKLY-KEY')

  // Initialize api service
  FeatureToggleClientService
    .initializeApiService({ 
      projectKey: 'project key', // LaunchDarkly project key, found in: AccountSettings-Projects 
      environmentKey: 'environment key', // LaunchDarkly environment key (production, test), found in: AccountSettings-Projects 
      authorizationToken: 'YOUR-LAUNCH-DARKLY-API-AUTHORIZATION-TOKEN'
    });
}
```

While checking for feature value, we recommend decouple a toggling decision point from the logic. ([ref](https://martinfowler.com/articles/feature-toggles.html)). So, we create a class that directly call our client and expose a method like so:

```typescript
const myFeatureFlagKey = 'feature-flag-key';
export class MyFeaturesDecisions {
  /**
   * Checking for application
   **/
  public static someFeatureApplicationEnabled(): Promise<any> {
    return FeatureToggleClientService
      .getInstance()
      .isApplicationFeatureEnabled(myFeatureFlagKey)
  }

  /**
   * Checking for user
   **/
  public static someFeatureUserEnabled(): Promise<any> {
    return FeatureToggleClientService
      .getInstance()
      .isUserFeatureEnabled(myFeatureFlagKey)
  }

  /**
   * Checking for user or application
   **/
  public static someFeatureEnabled(): Promise<any> {
    return FeatureToggleClientService
      .getInstance()
      .isFeatureEnabled(myFeatureFlagKey)
  }
}
```

So, in your controller, we recommend use of an interface `IToggleable` that implements `checkFeatures` method. This make class more clearly about it implementation.

```typescript
import { IToggleable } from 'feature-toggle-client'
import { MyFeaturesDecisions } from './MyFeaturesDecisions'

class Foo implements IToggleable {
  /**
   * Check for features
   **/
  public async checkFeatures(): Promise<any> {
    //Checking for user
    this.isUserFeatureEnabled = await MyFeaturesDecisions.someFeatureUserEnabled()

    //Checking for application
    this.isApplicationFeatureEnabled = await MyFeaturesDecisions.someFeatureApplicationEnabled()
  }
}
```

You can add a user to a feature toggle like the code:

```typescript
const myFeatureFlagKey = 'feature-flag-key';
export class MyFeaturesDecisions {
  /**
   * Adding user to a feature toggle
   **/
  public static addUserToSomeFeature(): Promise<bool> { // true if user was added successfully
    return FeatureToggleClientService
      .getInstance()
      .addUserToFeatureToggle({ email: 'user@mail.com' }, myFeatureFlagKey)
  }

  /**
   * Adding users to a feature toggle
   **/
  public static addUserToSomeFeature(): Promise<bool> { // true if user was added successfully
    return FeatureToggleClientService
      .getInstance()
      .addUserToFeatureToggle(
        [{ email: 'user1@mail.com' }, { email: 'user2@mail.com' }],
        myFeatureFlagKey)
  }
}
```

## Running tests

Create file `secret.ts` following this pattern

```typescript
export const secrectKey = 'YOUR-LAUNCH-DARKLY-KEY';
export const apiAuthorizationToken = 'YOUR-LAUNCH-DARKLY-API-AUTHORIZATION-TOKEN';
```

That's all!
