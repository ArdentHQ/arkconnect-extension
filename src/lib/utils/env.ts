import { ARK } from '@ardenthq/sdk-ark';
import { Environment } from '@ardenthq/sdk-profiles';
import { ExtensionClientStorage } from './env.storage';
import { httpClient } from '@/lib/services';
import { initializeArkNetworks } from '@/lib/utils/migrations/initialize-ark-networks';
import { connectedTransport as ledgerTransportFactory } from '@/lib/utils/transport';

export const initializeEnvironment = (): Environment => {
    const env = new Environment({
        coins: {
            ARK,
        },
        httpClient,
        ledgerTransportFactory,
        storage: new ExtensionClientStorage(),
    });

    env.setMigrations(
        {
            '0.0.9': initializeArkNetworks,
        },
        '0.0.9',
    );

    return env;
};
