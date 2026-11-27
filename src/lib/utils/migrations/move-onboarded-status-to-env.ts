import { storage } from 'webextension-polyfill';
import { KEY } from '@/lib/utils/localStorage';
import { EnvironmentData } from '@/lib/background/contracts';
import { Environment } from '@/lib/profiles';

export const moveOnboardedStatusToEnv = (env: Environment) => {
    return async () => {
        const data = await storage.local.get(KEY);

        if (data === null) {
            return;
        }

        const localStorage = data[KEY] as { hasOnboarded?: unknown } | undefined;
        const hasOnboarded = await env.data().get(EnvironmentData.HasOnboarded);

        if (typeof localStorage?.hasOnboarded === 'boolean' && hasOnboarded === undefined) {
            env.data().set(EnvironmentData.HasOnboarded, true);
        }
    };
};
