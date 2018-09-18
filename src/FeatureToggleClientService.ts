import { Application } from 'modules/shared/ApplicationTypings'
import { FeatureToggleInstanceFactory } from './FeatureToggleInstanceFactory'
import { LDClient } from 'ldclient-js'
import { UserAccount } from 'modules/account/AccountService'

export class FeatureToggleClientService {
  private static instance: FeatureToggleClientService
  private userInstance: LDClient
  private applicationInstance: LDClient

  private constructor() {
    if (FeatureToggleClientService.instance) {
      throw new Error(
        'FeatureToggleClientService is a singleton. Use getInstance() method instead of constructor'
      )
    }
  }

  public static getInstance(): FeatureToggleClientService {
    FeatureToggleClientService.instance =
      FeatureToggleClientService.instance || new FeatureToggleClientService()
    return FeatureToggleClientService.instance
  }

  /**
   * Initialize user instance
   * @param payload user account
   */
  public initializeUser(payload: UserAccount): void {
    this.userInstance = new FeatureToggleInstanceFactory(payload).getClient()
  }

  /**
   * Initialize application (bot) instance
   * @param payload application (bot)
   */
  public initializeApplication(payload: Application): void {
    this.applicationInstance = new FeatureToggleInstanceFactory(
      payload
    ).getClient()
  }

  /**
   * Verify if is feature enabled based on client and application instances
   * @param featureKey feature key configured on server
   * @param defaultValue
   */
  public async isFeatureEnabled(featureKey: string, defaultValue: boolean = false) {
    try {
      const [
        userInstanceReadyPromise,
        applicationInstanceReadyPromise
      ] = await Promise.all([
        this.isUserFeatureEnabled(featureKey, defaultValue),
        this.isApplicationFeatureEnabled(featureKey, defaultValue)
      ])

      return applicationInstanceReadyPromise || userInstanceReadyPromise
    } catch (e) {
      throw e;
    }
  }

  /**
   * Check if user feature is enabled
   * @param featureKey feature key configured on server
   * @param defaultValue
   */
  public isUserFeatureEnabled(
    featureKey: string,
    defaultValue: boolean = false
  ): Promise<{}> {
    const withUserFeaturePromise = new Promise(async (resolve, reject) => {
      try {
        await this.userInstance.waitUntilReady()
        resolve(this.userInstance.variation(featureKey, defaultValue))
      } catch (e) {
        reject(`Error while initializing LDClient (user instance): ${e}`)
      }
    })

    return withUserFeaturePromise
  }

  /**
   * Check if application feature is enabled
   * @param featureKey feature key configured on server
   * @param defaultValue
   */
  public isApplicationFeatureEnabled(
    featureKey: string,
    defaultValue: boolean = false
  ): Promise<{}> {
    const withApplicationFeaturePromise = new Promise(
      async (resolve, reject) => {
        try {
          await this.applicationInstance.waitUntilReady()
          resolve(this.applicationInstance.variation(featureKey, defaultValue))
        } catch (e) {
          reject(
            `Error while initializing LDClient (application instance): ${e}`
          )
        }
      }
    )

    return withApplicationFeaturePromise
  }
}
