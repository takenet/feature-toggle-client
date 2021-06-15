import { LaunchDarklyClient } from './launchDarklyClient';
import { FeatureToggleManager } from './featureToggleManager';
import { SegmentManager } from './segmentManager';

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const Run = async () => {
    const launchDarklyClient = new LaunchDarklyClient();

    const featureToggleManager = new FeatureToggleManager(launchDarklyClient);
    const segmentManager = new SegmentManager(launchDarklyClient);

    await segmentManager.copySegmentsAsync();

}

Run();