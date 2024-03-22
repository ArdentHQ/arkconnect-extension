import { Environment } from '@ardenthq/sdk-profiles';
import { storage } from 'webextension-polyfill';
import { KEY } from '@/lib/utils/localStorage';
import { EnvironmentData } from '@/lib/background/contracts';

export const moveOnboardedStatusToEnv = (env: Environment) => {
    return async () => {
        const data = await storage.local.get(KEY);

        if (data === null) {
            return;
        }

        const localStorage = data[KEY];
        const hasOnboarded = await env.data().get(EnvironmentData.HasOnboarded);

        if (typeof localStorage?.hasOnboarded === 'boolean' && hasOnboarded === undefined) {
            env.data().set(EnvironmentData.HasOnboarded, true);
        }
    };
};
