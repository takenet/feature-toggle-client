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
      email: 'user@email.com', // LauchDarkly key
    })

  // Initialize user application
  FeatureToggleClientService
    .initializeApplication({
      shortName: 'applicationShortName', // LauchDarkly key
      name: 'Application name',
    })
}
```

While checking for feature value, we recommend use of an interface `IToggleable` that implements `checkFeatures` method. This make class more clearly about it implementation.

```typescript
import {
  FeatureToggleClientService,
  IToggleable,
} from 'feature-toggle-client'

class Foo implements IToggleable {
  /**
   * Check for features
   **/
  public async checkFeatures(): Promise<any> {
    //Checking for user
    this.isUserFeatureEnabled =
      await FeatureToggleClientService
        .getInstance()
        .isUserFeatureEnabled('feature-key')

    //Checking for application
    this.isApplicationFeatureEnabled =
      await FeatureToggleClientService
        .getInstance()
        .isApplicationFeatureEnabled('feature-key')
  }
}
```

## Running tests

Create file `secret.ts` following this pattern

```typescript
export const secrectKey = 'YOUR-LAUNCH-DARKLY-KEY';
```

That's all!