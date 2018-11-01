import { Application } from './types/Application';
import { FeatureToggleInstanceFactory } from './FeatureToggleInstanceFactory';
import { LDClient, LDOptions } from 'ldclient-js';
import { UserAccount } from './types/UserAccount';

export class FeatureToggleClientService {
  private static instance: FeatureToggleClientService;
  private userInstance: LDClient;
  private applicationInstance: LDClient;

  private constructor() {
    if (FeatureToggleClientService.instance) {
      throw new Error(
        'FeatureToggleClientService is a singleton. Use getInstance() method instead of constructor'
      );
    }
  }

  /**
   * Returns private userInstance
   */
  public getUserInstance(): LDClient {
    return this.userInstance;
  }

  /**
   * Returns private application instance
   */
  public getApplicationInstance(): LDClient {
    return this.applicationInstance;
  }

  /**
   * Returns a singleton instance
   */
  public static getInstance(): FeatureToggleClientService {
    FeatureToggleClientService.instance =
      FeatureToggleClientService.instance || new FeatureToggleClientService();
    return FeatureToggleClientService.instance;
  }

  /**
   * Initialize user instance
   * @param payload user account
   */
  public initializeUser(
    payload: UserAccount,
    ldclientSdkKey: string,
    options?: LDOptions
  ): void {
    this.userInstance = new FeatureToggleInstanceFactory(
      payload,
      ldclientSdkKey,
      options,
    ).getClient();
  }

  /**
   * Initialize application (bot) instance
   * @param payload application (bot)
   */
  public initializeApplication(
    payload: Application,
    ldclientSdkKey: string,
    options?: LDOptions,
  ): void {
    this.applicationInstance = new FeatureToggleInstanceFactory(
      payload,
      ldclientSdkKey,
      options,
    ).getClient();
  }

  /**
   * Verify if is feature enabled based on client and application instances
   * @param featureKey feature key configured on server
   * @param defaultValue
   */
  public async isFeatureEnabled(
    featureKey: string,
    defaultValue: boolean = false
  ) {
    try {
      const [
        userInstanceReadyPromise,
        applicationInstanceReadyPromise
      ] = await Promise.all([
        this.isUserFeatureEnabled(featureKey, defaultValue),
        this.isApplicationFeatureEnabled(featureKey, defaultValue)
      ]);

      return applicationInstanceReadyPromise || userInstanceReadyPromise;
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
        if (this.userInstance) {
          await this.userInstance.waitUntilReady();
          resolve(this.userInstance.variation(featureKey, defaultValue));
        }
      } catch (e) {
        reject(`Error while initializing LDClient (user instance): ${e}`);
      }
    });

    return withUserFeaturePromise;
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
          if (this.applicationInstance) {
            await this.applicationInstance.waitUntilReady();
            resolve(this.applicationInstance.variation(featureKey, defaultValue));
          }
        } catch (e) {
          reject(
            `Error while initializing LDClient (application instance): ${e}`
          );
        }
      }
    );

    return withApplicationFeaturePromise;
  }
}
