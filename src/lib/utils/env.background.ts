import { ARK } from '@ardenthq/sdk-ark';
import { Environment } from '@ardenthq/sdk-profiles';
import { httpClient } from '@/lib/services';
import { initializeArkNetworks } from '@/lib/utils/migrations/initialize-ark-networks';
import { connectedTransport as ledgerTransportFactory } from '@/lib/utils/transport';

export const initializeEnvironment = (): Environment => {
    const storage = 'indexeddb';
    const env = new Environment({
        coins: {
            ARK,
        },
        httpClient,
        ledgerTransportFactory,
        storage,
    });

    env.setMigrations(
        {
            '0.0.9': initializeArkNetworks,
        },
        '0.0.9',
    );

    return env;
};
