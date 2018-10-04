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

Initialize user or application with an payload and LauchDarkly key

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

## Running tests

Create file `secret.ts` following this pattern

```typescript
export const secrectKey = 'YOUR-LAUNCH-DARKLY-KEY';
```

That's all!