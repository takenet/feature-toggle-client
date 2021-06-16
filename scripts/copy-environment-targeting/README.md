# Copy Toggles Targeting
This script allows you copy all feature toggles targetting from one environment to another. See more about copying toggles [here](https://apidocs.launchdarkly.com/reference#copy-feature-flag).

The copying includes targeting, individual users targeting, rules maching targeting and default targeting.

---
## Configure Settings
On `src` directory a `settings.json` is available. Fill it with your informations.

`COPY_SEGMENTS` will copy the project segments from one environment to another. If set as `false`, feature toggles with segment rules won't be copied.

`ALLOW_SELF_SIGNED_CERTIFICATE` allow node communicate with Launch Darkly API using a Self Signed Certificate. Set as `true` if you face some problem with Launch Darkly certificates.

```json
{
    "LAUNCH_DARKLY_TOKEN": "",
    "PROJECT": "",
    "SOURCE_ENVIRONMENT": "",
    "TARGET_ENVIRONMENT": "",
    "COPY_SEGMENTS": true,
    "ALLOW_SELF_SIGNED_CERTIFICATE": true
}
```

---
## Usage
Go to script directory
```bash
cd scripts\copy-environment-targeting
```

Install dependencies
```bash
npm install
```

Run script
```bash
npm start
```

After execution, a detailed log will be available on `src/output/logs.txt`.
There will be shown all toggles that were copied with success and toggles that weren't copied due some exception.

Example
```
(Wed, 16 Jun 2021 12:54:10 GMT) INFO - 5 segments found on environment production
(Wed, 16 Jun 2021 12:54:10 GMT) INFO - 4 segments found on environment testing
(Wed, 16 Jun 2021 12:54:13 GMT) INFO - Segment beta-users copied to environment testing
(Wed, 16 Jun 2021 12:55:22 GMT) INFO - 180 feature toggles found on environment production
(Wed, 16 Jun 2021 12:55:50 GMT) INFO - Feature toggle show-new-feature copied to environment testing
...
```