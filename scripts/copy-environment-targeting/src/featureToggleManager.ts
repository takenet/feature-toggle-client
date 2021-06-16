import { FeatureFlag } from 'launchdarkly-api-typescript';
import { LaunchDarklyClient } from './launchDarklyClient';
import { Logger } from './logger';
import settings from './settings.json';

export class FeatureToggleManager {
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

    async copyFeatureTogglesAsync(): Promise<void> {
        const featureToggles = await this.getFeatureTogglesAsync();

        for (let i = 0; i < featureToggles.length; i++) {
            if (featureToggles[i].key === undefined) continue;

            try {
                await this.launchDarklyClient.copyFeatureToggleAsync(
                    this.project,
                    featureToggles[i].key || "",
                    this.sourceEnvironment,
                    this.targetEnvironment
                )

                this.logger.logAsync("info", `Feature toggle ${featureToggles[i].key} copied to environment ${this.targetEnvironment}`);

                // Avoid rate limit reaching
                await new Promise(resolve => setTimeout(resolve, 12100));
            } catch (err) {
                this.logger.logAsync("error", `Could not copy feature toggle ${featureToggles[i].key} to environment ${this.targetEnvironment}. ${err.message}`);
            }
        }
    }

    async getFeatureTogglesAsync(): Promise<Array<FeatureFlag>> {
        try {
            const featureToggles = await this.launchDarklyClient.getFeatureToggles(
                this.project
            )
            this.logger.logAsync("info", `${featureToggles.length} feature toggles found on environment ${this.sourceEnvironment}`);

            return featureToggles;

        } catch(err) {
            this.logger.logAsync("error", `Could not get feature toggles on environment ${this.sourceEnvironment}. ${err.message}`);

            throw err;
        }
    }

    private checkRequiredSettings() {
        if (this.project === "" || this.sourceEnvironment === "" || this.targetEnvironment === "") {
            throw new Error("One of the following settings is empty: PROJECT, SOURCE_ENVIRONMENT, TARGET_ENVIRONMENT");
        }
    }
}