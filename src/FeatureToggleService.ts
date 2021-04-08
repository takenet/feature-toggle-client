import { UserAccount } from './types/UserAccount';
import { IFeatureToggleServiceSettings } from './types/IFeatureToggleServiceSettings';

const axios = require('axios').default;

export class FeatureToggleService {

  private readonly API_URL = 'https://app.launchdarkly.com/api/v2/flags';
  private readonly DEFAULT_COMMENT = 'modified by feature-toggle-client';
  private readonly ADD_USER_TARGETS = 'addUserTargets';
  private readonly STATUS_CODE_OK = 200;
  private static instance: FeatureToggleService;
  private settings: IFeatureToggleServiceSettings;

  private constructor() {
    if (FeatureToggleService.instance) {
      throw new Error(
        'FeatureToggleService is a singleton. Use getInstance() method instead of constructor'
      );
    }
  }

  private getApiRequestUrl(
    featureKey: string,
    ignoreConflicts: boolean
  ): string {
    return `${this.API_URL}/${this.settings.projectKey}/${featureKey}?ignoreConflicts=${ignoreConflicts}`
  }

  private getApiRequestHeaders() {
    return {
      'Content-Type': 'application/json; domain-model=launchdarkly.semanticpatch',
      'Authorization': this.settings.authorizationToken
    }
  }

  private getAddUserTargetsDataFormat(user: UserAccount) {
    const data = {
      comment: this.DEFAULT_COMMENT,
      environmentKey: this.settings.environmentKey,
      instructions: [
        {
          kind: this.ADD_USER_TARGETS,
          variationId: "ed55a0db-2f79-4206-be03-57392022c0ca",
          values: [ user.email ]
        }
      ]
    }
    return data;
  }

  /**
   * Returns a singleton instance
   */
   public static getInstance(): FeatureToggleService {
    FeatureToggleService.instance =
      FeatureToggleService.instance || new FeatureToggleService();
    return FeatureToggleService.instance;
  }

  /**
   * Initialize api service
   * @param settings feature toggle api authorization and environment keys
   */
  public initializeService(
    settings: IFeatureToggleServiceSettings
  ): void {
    this.settings = settings;
  }

  /**
   * Add an user to a feature toggle
   * @param user user account
   * @param featureKey feature key configured on server
   */
  public async addUserToFeatureToggle(
    user: UserAccount,
    featureKey: string
  ): Promise<boolean> {
    try {
      const data = this.getAddUserTargetsDataFormat(user);
      const url = this.getApiRequestUrl(featureKey, true);
      const response = await axios.patch(url, data,
        { headers: this.getApiRequestHeaders() }
      );
      return response.status == this.STATUS_CODE_OK;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
