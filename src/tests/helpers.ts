import { Base64 } from '@ardenthq/sdk-cryptography';
import { Environment, StorageData } from '@ardenthq/sdk-profiles';

import fixtureData from '@/tests/fixtures/env/storage.json';
import TestingPasswords from '@/tests/fixtures/env/testing-passwords.json';

export const bootEnvironmentWithProfileFixtures = async ({
    env,
    shouldRestoreDefaultProfile = false,
}: {
    env: Environment;
    shouldRestoreDefaultProfile?: boolean;
}) => {
    const ids = Object.keys(fixtureData.profiles);
    const fixtureProfiles: any = fixtureData.profiles;
    const storageData: StorageData = { data: {}, profiles: {} };

    for (const id of ids) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const password: string = TestingPasswords?.profiles[id]?.password;

        const profileData = { id, ...fixtureProfiles[id] };
        let data = Base64.encode(JSON.stringify(profileData));

        if (password) {
            // Re-import profile as passwordless, reset password and dump encrypted data.
            delete profileData.settings.password;

            const passwordProtectedProfile = await env.profiles().import(data);
            await env.profiles().restore(passwordProtectedProfile);
            passwordProtectedProfile.auth().setPassword(password);

            data = await env.profiles().export(passwordProtectedProfile, undefined, password);
        }

        storageData.profiles[id] = {
            data,
            id,
            name: fixtureProfiles[id].settings.NAME,
            password: fixtureProfiles[id].settings.PASSWORD,
        };
    }

    await env.verify(storageData);
    await env.boot();

    // await env.profiles().restore(env.profiles().last(), "password");

    if (shouldRestoreDefaultProfile) {
        const profile = env.profiles().first();
        await env.profiles().restore(profile);

        await profile.sync();
    }
};

export const isUnit = () =>
    !!['true', '1'].includes(process.env.REACT_APP_IS_UNIT?.toLowerCase() || '');
