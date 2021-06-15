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

    }

    async getFeatureToggles(): Promise<any> {

    }
}