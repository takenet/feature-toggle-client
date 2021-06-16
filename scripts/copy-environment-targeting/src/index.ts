import { LaunchDarklyClient } from './launchDarklyClient';
import { FeatureToggleManager } from './featureToggleManager';
import { SegmentManager } from './segmentManager';
import settings from './settings.json';
import { Logger } from './logger';

if (settings.ALLOW_SELF_SIGNED_CERTIFICATE) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

const Run = async () => {
    const launchDarklyClient = new LaunchDarklyClient();
    const logger = new Logger();

    if (settings.COPY_SEGMENTS) {
        const segmentManager = new SegmentManager(
            launchDarklyClient,
            logger);
        await segmentManager.copySegmentsAsync();
    }

    const featureToggleManager = new FeatureToggleManager(
        launchDarklyClient,
        logger);
    await featureToggleManager.copyFeatureTogglesAsync();
}

console.info("Execution has started. Detailed execution logs will be avaliable on \"src/output/logs.txt\"");
Run();
console.info("Execution has endded. Detailed execution logs are avaliable on \"src/output/logs.txt\"");