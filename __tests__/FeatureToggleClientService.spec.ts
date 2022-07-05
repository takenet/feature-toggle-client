import { LDClient, LDOptions, LDUser } from "launchdarkly-js-client-sdk";
import { FeatureToggleClientService } from "../src/FeatureToggleClientService";
import { Application } from "../src/types/Application";
import { UserAccount } from "../src/types/UserAccount";

const LD_CLIENT_SDK_KEY = 'mock-key';
const MOCK_VARIATION_RETURN = true;

jest.mock('launchdarkly-js-client-sdk', () => {
  return {
    initialize: (envKey: string, user: LDUser, option: LDOptions): LDClient => ({
      getUser: (): LDUser => user,
      waitUntilReady: async (): Promise<void> => undefined,
      waitForInitialization: async (): Promise<void> => undefined,
      variation: (featureKey: string, defaultValue: unknown) => MOCK_VARIATION_RETURN,
    } as LDClient)
  }
});

describe('Feature toggle client service tests', () => {

  it('Should get client singleton instance', () => {
    const firstInstance = FeatureToggleClientService.getInstance();
    const secondInstance = FeatureToggleClientService.getInstance();

    expect(firstInstance).toBeInstanceOf(FeatureToggleClientService);
    expect(firstInstance).toBe(secondInstance);
  });

  it('Should initialize client with an user instance', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const user = new UserAccount({
      address: 'My Address',
      email: 'user@email.com',
      fullName: 'User Full Name',
      id: 1,
      password: '1234',
      phoneNumber: '3333-3333',
    });
    instance.initializeUser(user, LD_CLIENT_SDK_KEY);

    const client = instance.getUserInstance();
    await client.waitUntilReady();
    const userData = client.getUser();

    expect(userData.name).toBe(user.fullName);
    expect(userData.email).toBe(user.email);
    expect(userData.key).toBe(user.email);
  });

  it('Should initialize client with an application instance', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const application = new Application({
      name: 'Application name',
      shortName: 'applicationShortName',
      template: 'builder',
      hasCluster: true,
    });
    instance.initializeApplication(application, LD_CLIENT_SDK_KEY);

    const client = instance.getApplicationInstance();
    await client.waitUntilReady();
    const userData = client.getUser();

    expect(userData.name).toBe(application.name);
    expect(userData.email).toBe(`${application.shortName}@msging.net`);
    expect(userData.key).toBe(application.shortName);
  });

  it('Should initialize client with a non clustered application instance', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const application = new Application({
      name: 'Application name',
      shortName: 'applicationShortName',
      template: 'builder',
      hasCluster: false,
    });
    instance.initializeApplication(application, LD_CLIENT_SDK_KEY);

    const client = instance.getApplicationInstance();
    await client.waitUntilReady();
    const userData = client.getUser();

    expect(userData.name).toBe('free');
    expect(userData.email).toBe('free@free.com');
    expect(userData.key).toBe('free');
  });

  it('Should check for an user feature', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const user = new UserAccount({
      email: 'user@email.com',
      fullName: 'Samuel Martins',
    });

    instance.initializeUser(user, LD_CLIENT_SDK_KEY);
    const isUserFeatureEnabled = await instance.isUserFeatureEnabled('feature-test', true);

    expect(isUserFeatureEnabled).toBe(MOCK_VARIATION_RETURN);
  });

  it('Should check for an application feature', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const application = new Application({
      name: 'Application name',
      shortName: 'applicationShortName',
      template: 'builder'
    });

    instance.initializeApplication(application, LD_CLIENT_SDK_KEY);
    const isApplicationFeatureEnabled = await instance.isApplicationFeatureEnabled('feature-test', true);

    expect(isApplicationFeatureEnabled).toBe(MOCK_VARIATION_RETURN);
  });

  it('Should check for user or application instance feature', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const application = new Application({
      name: 'Application name',
      shortName: 'applicationShortName',
      template: 'builder'
    });
    instance.initializeApplication(application, LD_CLIENT_SDK_KEY);
    const user = new UserAccount({
      email: 'user@email.com',
      fullName: 'Samuel Martins',
    });
    instance.initializeUser(user, LD_CLIENT_SDK_KEY);

    const isFeatureEnabled = await instance.isFeatureEnabled('feature-test', true);

    expect(isFeatureEnabled).toBe(MOCK_VARIATION_RETURN);
  });

  it('Should return default value if default timeout has exceeded', async () => {
    const instance = FeatureToggleClientService.getInstance();
    const fakePromise = new Promise(resolve => {
      setTimeout(() => resolve(true), 1500);
    });
    const user = new UserAccount({
      email: 'user@email.com',
      fullName: 'Samuel Martins',
    });

    instance.initializeUser(user, LD_CLIENT_SDK_KEY);
    instance.setRequestTimeouts(1000);

    const resolvedValue = await (instance as any).solveRequestWithTimeout(fakePromise, false);
    expect(resolvedValue).toBeFalsy();
  });
});
