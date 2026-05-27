import { ExtensionClientStorage } from './env.storage';
import { Environment } from '@/lib/profiles';

export const initializeEnvironment = (): Environment => {
    return new Environment({
        storage: new ExtensionClientStorage(),
    });
};
