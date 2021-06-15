import axios, { AxiosResponse, Method } from 'axios';
import {
    FeatureFlagsApi,
    FeatureFlagsApiApiKeys,
    FeatureFlagCopyBody,
    FeatureFlagCopyObject,
    FeatureFlag } from "launchdarkly-api-typescript";
import { Segment } from "./DTOs/segment";
import settings from './settings.json';

export class LaunchDarklyClient {
    private baseUrl = "https://app.launchdarkly.com/api/v2";
    private token: string;
    private apiInstance: FeatureFlagsApi;

    constructor () {
        this.token = settings.LAUNCH_DARKLY_TOKEN;
        this.checkRequiredSettings();

        this.apiInstance = new FeatureFlagsApi();
        this.apiInstance.setApiKey(FeatureFlagsApiApiKeys.Token, this.token);
    }

    async getFeatureToggles(projectId: string): Promise<Array<FeatureFlag>> {
        const result = await this.apiInstance.getFeatureFlags(projectId);
        return result.body.items || [];
    }

    async copyFeatureToggleAsync(projectKey: string, featureToggleKey: string, sourceEnvironmentKey: string, targetEnvironmentKey: string): Promise<void> {
        let source = new FeatureFlagCopyObject();
        source.key = sourceEnvironmentKey;

        let target = new FeatureFlagCopyObject();
        target.key = targetEnvironmentKey;

        let featureFlagCopyBody = new FeatureFlagCopyBody();
        featureFlagCopyBody.source = source;
        featureFlagCopyBody.target = target;

        await this.apiInstance.copyFeatureFlag(
            projectKey,
            featureToggleKey,
            featureFlagCopyBody);
    }

    async getSegmentsAsync(projectKey: string, environmentKey: string): Promise<Array<Segment>> {
        var result = await this.sendAsHttpRequestAsync(
            "GET",
            `/segments/${projectKey}/${environmentKey}`
        )

        return result.data.items.map(item => {
            let segment = new Segment();
            segment.name = item.name;
            segment.key = item.key;
            segment.description = item.description;

            return segment;
        });
    }

    async createSegmentAsync(projectKey: string, environmentKey: string, segment: Segment): Promise<void> {
        await this.sendAsHttpRequestAsync(
            "POST",
            `/segments/${projectKey}/${environmentKey}`,
            segment
        )
    }

    private async sendAsHttpRequestAsync(method: Method, path: string, data: any = undefined): Promise<AxiosResponse<any>> {
        return await axios.request({
            method,
            url: `${this.baseUrl}${path}`,
            data,
            headers: { Authorization: this.token }
        })
    }

    private checkRequiredSettings() {
        if (this.token === "") {
            throw new Error("One of the following settings is empty: LAUNCH_DARKLY_TOKEN");
        }
    }
}
