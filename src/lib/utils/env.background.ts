import { httpClient } from '@/lib/services';
import { Environment } from '@/lib/profiles';

export const initializeEnvironment = (): Environment => {
    const storage = 'indexeddb';
    return new Environment({
        httpClient,
        storage,
    });
};
