import { LaunchDarklyClient } from './launchDarklyClient';
import { FeatureToggleManager } from './featureToggleManager';
import { SegmentManager } from './segmentManager';
import settings from './settings.json';

if (settings.ALLOW_SELF_SIGNED_CERTIFICATE) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

const Run = async () => {
    const launchDarklyClient = new LaunchDarklyClient();

    if (settings.COPY_SEGMENTS) {
        const segmentManager = new SegmentManager(launchDarklyClient);
        await segmentManager.copySegmentsAsync();
    }

    const featureToggleManager = new FeatureToggleManager(launchDarklyClient);
    await featureToggleManager.copyFeatureTogglesAsync();
}

Run();