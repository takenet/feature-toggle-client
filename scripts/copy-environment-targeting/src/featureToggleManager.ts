import { FeatureFlag } from 'launchdarkly-api-typescript';
import { LaunchDarklyClient } from './launchDarklyClient';
import settings from './settings.json';

export class FeatureToggleManager {
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

    async copyFeatureTogglesAsync(): Promise<void> {
        const featureToggles = await this.getFeatureTogglesAsync();

        for (let i = 0; i < featureToggles.length; i++) {
            if (featureToggles[i].key === undefined) continue;

            await this.launchDarklyClient.copyFeatureToggleAsync(
                this.project,
                featureToggles[i].key || "",
                this.sourceEnvironment,
                this.targetEnvironment
            )
        }
    }

    async getFeatureTogglesAsync(): Promise<Array<FeatureFlag>> {
        return await this.launchDarklyClient.getFeatureToggles(
            this.project
        )
    }
}