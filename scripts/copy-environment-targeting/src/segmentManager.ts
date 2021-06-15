import { LaunchDarklyClient } from "./launchDarklyClient";
import settings from "./settings.json";

export class SegmentManager {
    private launchDarklyClient: LaunchDarklyClient;
    private project: string;
    private sourceEnvironment: string;
    private targetEnvironment: string;

    constructor(
        launchDarklyClient: LaunchDarklyClient
    ) {
        this.launchDarklyClient = launchDarklyClient;
        this.project = settings.PROJECT;
        this.sourceEnvironment = settings.SOURCE_ENVIRONMENT;
        this.targetEnvironment = settings.TARGET_ENVIRONMENT;
    }

    async copySegmentsAsync(): Promise<void> {
        var sourceSegments = await this.launchDarklyClient.getSegmentsAsync(
            this.project,
            this.sourceEnvironment
        )

        var targetSegments = await this.launchDarklyClient.getSegmentsAsync(
            this.project,
            this.targetEnvironment
        )

        const missingSegments = sourceSegments
            .filter(ss => targetSegments.find(ts => ts.key === ss.key) === undefined);

        for (let i = 0; i < missingSegments.length; i++) {
            await this.launchDarklyClient.createSegmentAsync(
                this.project,
                this.targetEnvironment,
                missingSegments[i]
            )

            // Avoid rate limit reaching
            await new Promise(resolve => setTimeout(resolve, 200));
        };
    }
}
