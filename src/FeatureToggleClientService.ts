import { Application } from './types/Application';
import { FeatureToggleInstanceFactory } from './FeatureToggleInstanceFactory';
import { LDClient, LDOptions } from 'launchdarkly-js-client-sdk';
import { UserAccount } from './types/UserAccount';

const DEFAULT_REQUEST_TIMEOUT = 5000;

export class FeatureToggleClientService {
  private static instance: FeatureToggleClientService;
  private userInstance: LDClient;
  private applicationInstance: LDClient;
  private requestTimeout: number = DEFAULT_REQUEST_TIMEOUT;

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
   * Set request timeouts
   */
  public setRequestTimeouts(timeout: number): void {
    this.requestTimeout = timeout;
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
    options?: LDOptions
  ): void {
    this.applicationInstance = new FeatureToggleInstanceFactory(
      payload,
      ldclientSdkKey,
      options,
    ).getClient();
  }

  /**
   * Solve feature request with configured timeouts
   * @param requestPromise Feature request promise
   */
  private solveRequestWithTimeout(requestPromise: Promise<any>, defaultValue: boolean): Promise<any> {
    return Promise.race([requestPromise, new Promise(resolve => {
      setTimeout(() => resolve(defaultValue), this.requestTimeout);
    })]);
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
      ] = await this.solveRequestWithTimeout(Promise.all([
        this.isUserFeatureEnabled(featureKey, defaultValue),
        this.isApplicationFeatureEnabled(featureKey, defaultValue)
      ]), defaultValue);

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
  ): Promise<any> {
    const withUserFeaturePromise = new Promise(async (resolve, reject) => {
      try {
        if (this.userInstance) {
          await this.userInstance.waitForInitialization();
          resolve(this.userInstance.variation(featureKey, defaultValue));
        } else {
          resolve(undefined);
        }
      } catch (e) {
        reject(defaultValue);
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
  ): Promise<any> {
    const withApplicationFeaturePromise = new Promise(
      async (resolve, reject) => {
        try {
          if (this.applicationInstance) {
            await this.applicationInstance.waitForInitialization();
            resolve(this.applicationInstance.variation(featureKey, defaultValue));
          } else {
            resolve(undefined);
          }
        } catch (e) {
          reject(defaultValue);
        }
      }
    );

    return withApplicationFeaturePromise;
  }
}
