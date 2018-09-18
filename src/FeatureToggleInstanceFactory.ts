import { initialize, LDUser, LDClient } from 'ldclient-js'
import { UserAccount } from 'modules/account/AccountService'
import { Application } from 'modules/shared/ApplicationTypings'
import { ldclientSdkKey } from 'app.constants'

export class FeatureToggleInstanceFactory {
  private client: LDClient

  constructor(payload: UserAccount | Application) {
    this.client = initialize(ldclientSdkKey, this.userPayloadByType(payload))
  }

  /**
   * Return client instance
   */
  public getClient() {
    return this.client
  }

  /**
   * Return instance user by payload type
   * @param userPayload - user or application
   */
  private userPayloadByType(userPayload: any): LDUser {
    const applicationJson = (payload: any) =>
      payload.hasCluster
        ? {
            custom: {
              group: 'bot'
            },
            email: `${payload.shortName}@msging.net`,
            key: payload.shortName,
            name: payload.name,
          }
        : {
            custom: {
              group: 'bot'
            },
            email: 'free@free.com',
            key: 'free',
            name: 'free',
          }

    return userPayload.email
      ? {
          custom: {
            group: 'users'
          },
          email: userPayload.email,
          key: userPayload.email,
          name: userPayload.fullName,
        }
      : applicationJson(userPayload)
  }
}
