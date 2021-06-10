import { initialize, LDUser, LDClient, LDOptions } from 'launchdarkly-js-client-sdk';
import { UserAccount } from './types/UserAccount';
import { Application } from './types/Application';
import * as uuid from 'uuid';

const applicationByCluster = (p: any) =>
  p.hasCluster
    ? {
        custom: {
          group: 'bot',
        },
        email: `${p.shortName}@msging.net`,
        key: p.shortName,
        name: p.name,
      }
    : {
        custom: {
          group: 'bot',
        },
        email: 'free@free.com',
        key: 'free',
        name: 'free',
      };

export class FeatureToggleInstanceFactory {
  private client: LDClient;
  private defaultOptions: Partial<LDOptions> = {
    bootstrap: 'localStorage'
  };

  constructor(payload: UserAccount | Application, ldclientSdkKey: string, options?: LDOptions) {
    this.client = initialize(ldclientSdkKey, this.payloadByType(payload), { ...options, ...this.defaultOptions });
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
  private payloadByType(payload: any): LDUser {
    const isUser = () => payload.email;

    if (isUser()) {
      if (payload.anonymous) {
        return {
          anonymous: true,
          key: uuid.v4(),
          ...payload,
        };
      } else {
        return {
          custom: {
            group: 'users',
          },
          email: payload.email,
          key: payload.email,
          name: payload.fullName,
        };
      }
    }

    return applicationByCluster(payload);
  }
}
