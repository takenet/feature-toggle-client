import { Segment } from "./DTOs/segment";
import { LaunchDarklyClient } from "./launchDarklyClient";
import { Logger } from "./logger";
import settings from "./settings.json";

export class SegmentManager {
    private project: string;
    private sourceEnvironment: string;
    private targetEnvironment: string;

    constructor(
        private launchDarklyClient: LaunchDarklyClient,
        private logger: Logger
    ) {
        this.project = settings.PROJECT;
        this.sourceEnvironment = settings.SOURCE_ENVIRONMENT;
        this.targetEnvironment = settings.TARGET_ENVIRONMENT;
        this.checkRequiredSettings();
    }

    async copySegmentsAsync(): Promise<void> {
        var sourceSegments = await this.getEnvironmentSegmentsAsync(this.sourceEnvironment);
        var targetSegments = await this.getEnvironmentSegmentsAsync(this.targetEnvironment);

        const missingSegments = sourceSegments
            .filter(ss => targetSegments.find(ts => ts.key === ss.key) === undefined);

        for (let i = 0; i < missingSegments.length; i++) {
            try {
                await this.launchDarklyClient.createSegmentAsync(
                    this.project,
                    this.targetEnvironment,
                    missingSegments[i]
                )

                this.logger.logAsync("info", `Segment ${missingSegments[i].key} copied to environment ${this.targetEnvironment}`);

                // Avoid rate limit reaching
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (err) {
                this.logger.logAsync("error", `Could not copy segment ${missingSegments[i].key} to environment ${this.targetEnvironment}. ${err.message}`);
            }
        };
    }

    async getEnvironmentSegmentsAsync(environment: string): Promise<Array<Segment>> {
        try {
            var segments = await this.launchDarklyClient.getSegmentsAsync(
                this.project,
                environment
            )
            this.logger.logAsync("info", `${segments.length} segments found on environment ${environment}`);

            return segments;

        } catch(err) {
            this.logger.logAsync("error", `Could not get segments on environment ${environment}. ${err.message}`);

            throw err;
        }
    }

    private checkRequiredSettings() {
        if (this.project === "" || this.sourceEnvironment === "" || this.targetEnvironment === "") {
            throw new Error("One of the following settings is empty: PROJECT, SOURCE_ENVIRONMENT, TARGET_ENVIRONMENT");
        }
    }
}
