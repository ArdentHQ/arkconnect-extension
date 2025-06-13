import { ExtensionClientStorage } from './env.storage';
import { httpClient } from '@/lib/services';
import { Environment } from '@/lib/profiles';

export const initializeEnvironment = (): Environment => {
    return new Environment({
        httpClient,
        storage: new ExtensionClientStorage(),
    });
};
