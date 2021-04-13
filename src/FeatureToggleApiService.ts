import { AddUserRequest } from './types/AddUserRequest';
import { UserAccount } from './types/UserAccount';
import { IFeatureToggleServiceSettings } from './types/IFeatureToggleServiceSettings';
import { Instruction } from './types/Instruction';

const axios = require('axios').default;

export class FeatureToggleApiService {
  private readonly API_URL = 'https://app.launchdarkly.com/api/v2/flags';
  private readonly DEFAULT_COMMENT = 'modified by feature-toggle-client';
  private readonly ADD_USER_TARGETS = 'addUserTargets';
  private readonly STATUS_CODE_OK = 200;
  private settings: IFeatureToggleServiceSettings;

  constructor(settings: IFeatureToggleServiceSettings) {
    this.settings = settings;
  }

  private getApiRequestUrl(
    featureKey: string,
    ignoreConflicts: boolean
  ): string {
    return `${this.API_URL}/${
      this.settings.projectKey
    }/${featureKey}?ignoreConflicts=${ignoreConflicts}`;
  }

  private getApiRequestHeaders() {
    return {
      'Content-Type':
        'application/json; domain-model=launchdarkly.semanticpatch',
      Authorization: this.settings.authorizationToken
    };
  }

  private getAddUserTargetsDataFormat(users: UserAccount[], variationId: string) {
    const instructions = [];
    instructions.push(new Instruction({
      kind: this.ADD_USER_TARGETS,
      variationId: variationId,
      values: users.map(user => user.email)
    }));

    const addUserRequest = new AddUserRequest({
      comment: this.DEFAULT_COMMENT,
      environmentKey: this.settings.environmentKey,
      instructions: instructions
    });

    return addUserRequest;
  }

  private async getVariationId(featureKey: string): Promise<string> {
    const url = this.getApiRequestUrl(featureKey, true);
    const response = await axios.get(url, {
      headers: this.getApiRequestHeaders()
    });
    if (response.status == this.STATUS_CODE_OK) {
      const variation = response.data.variations.find(variation => {
        return variation.value === true;
      });
      return variation._id;
    }
    throw 'Error getting variation id';
  }

  /**
   * Add an user to a feature toggle
   * @param user user account
   * @param featureKey feature key configured on server
   */
  public async addUsersToFeatureToggle(
    users: UserAccount[],
    featureKey: string
  ): Promise<boolean> {
    try {
      const variationId = await this.getVariationId(featureKey);

      const data = this.getAddUserTargetsDataFormat(users, variationId);

      const url = this.getApiRequestUrl(featureKey, true);

      const response = await axios.patch(url, data, {
        headers: this.getApiRequestHeaders()
      });

      return response.status == this.STATUS_CODE_OK;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}