import { initialize, LDUser, LDClient, LDOptions } from 'launchdarkly-js-client-sdk';
import { UserAccount } from './types/UserAccount';
import { Application } from './types/Application';
import * as uuid from 'uuid';

const getApplicationData = (p: any) : LDUser =>
  p.hasCluster
    ? {
        custom: {
          group: 'bot',
          tenantId: p.tenantId
        },
        email: `${p.shortName}@msging.net`,
        key: p.shortName,
        name: p.name,
      }
    : {
        custom: {
          group: 'bot',
          tenantId: p.tenantId
        },
        email: 'free@free.com',
        key: 'free',
        name: 'free',
      };

const getUserData = (p: any): LDUser =>
  p.anonymous
    ? {
      anonymous: true,
      key: uuid.v4(),
      ...p,
    }
    : {
      custom: {
        creationDate: p.creationDate,
        group: 'users',
      },
      email: p.email,
      key: p.email,
      name: p.fullName,
    };
    
export class FeatureToggleInstanceFactory {
  private client: LDClient;
  private defaultOptions: Partial<LDOptions> = {
    bootstrap: 'localStorage'
  };

  constructor(payload: UserAccount | Application, ldclientSdkKey: string, options?: LDOptions) {
    this.client = initialize(
      ldclientSdkKey,
      this.initLaunchDarklyUser(payload),
      { ...options, ...this.defaultOptions }
    );
  }

  /**
   * Return client instance
   */
  public getClient() {
    return this.client;
  }

  /**
   * Return instance user by payload type
   * @param payload - user or application
   */
  private initLaunchDarklyUser(payload: any): LDUser {
    const isUser = () => payload.email;
    
    if (isUser()) {
      return getUserData(payload);
    }

    return getApplicationData(payload);
  }
}
