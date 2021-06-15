# Copy Toggles Targeting
This script allows you copy all feature toggles targetting from one environment to another. See more about copying toggles [here](https://apidocs.launchdarkly.com/reference#copy-feature-flag).

The copying includes targeting, individual users targeting, rules maching targeting and default targeting.

---
## Configure Settings
On `src` directory a `settings.json` is available. Fill it with your informations.

`COPY_SEGMENTS` will copy the project segments from a environment to another. If set as `false`, feature toggles with segment rules won't be copied.

`ALLOW_SELF_SIGNED_CERTIFICATE` allow node communicae with Launch Darkly API using a Self Signed Certificate. Set as `true` if you face some problem with Launch Darkly certificates.

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
