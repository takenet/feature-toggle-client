import { initialize, LDUser, LDClient } from 'ldclient-js';
import { UserAccount } from 'modules/account/AccountService';
import { Application } from 'modules/shared/ApplicationTypings';
import { ldclientSdkKey } from 'app.constants';

export class FeatureToggleInstanceFactory {
    private client: LDClient;

    constructor(payload: UserAccount | Application) {
        this.client = initialize(
            ldclientSdkKey,
            this.userPayloadByType(payload),
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
    private userPayloadByType(payload): LDUser {
        const applicationJson = payload =>
            payload.hasCluster
                ? {
                    key: payload.shortName,
                    name: payload.name,
                    email: `${payload.shortName}@msging.net`,
                    custom: {
                        group: 'bot'
                    }
                }
                : {
                    key: 'free',
                    name: 'free',
                    email: 'free@free.com',
                    custom: {
                        group: 'bot'
                    }
                };

        return (payload.email)
            ? {
                  key: payload.email,
                  name: payload.fullName,
                  email: payload.email,
                  custom: {
                      group: 'users'
                  }
              }
            : applicationJson(payload);
    }
}
