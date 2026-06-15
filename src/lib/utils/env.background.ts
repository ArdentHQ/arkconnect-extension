import { Environment } from '@/lib/profiles';
import { LocalStorage } from '@/lib/profiles/local.storage';

export const initializeEnvironment = (): Environment => {
    return new Environment({
        storage: new LocalStorage('indexeddb'),
    });
};
