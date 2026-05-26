import { Environment } from '@/lib/profiles';

export const initializeEnvironment = (): Environment => {
    const storage = 'indexeddb';
    return new Environment({
        storage,
    });
};
