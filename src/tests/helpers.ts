import { Base64 } from '@ardenthq/arkvault-crypto';
import fixtureData from '@/tests/fixtures/env/storage.json';
import TestingPasswords from '@/tests/fixtures/env/testing-passwords.json';
import { Contracts, Environment, StorageData } from '@/lib/profiles';

/**
 * Boots the environment from the fixture storage and returns every fixture
 * profile keyed by id, since the environment only ever keeps one profile
 * active at a time.
 */
export const bootEnvironmentWithProfileFixtures = async ({
    env,
    shouldRestoreDefaultProfile = false,
}: {
    env: Environment;
    shouldRestoreDefaultProfile?: boolean;
}): Promise<Record<string, Contracts.IProfile>> => {
    const ids = Object.keys(fixtureData.profiles);
    const fixtureProfiles: any = fixtureData.profiles;
    const storageData: StorageData = { data: {}, profiles: {} };
    const profiles: Record<string, Contracts.IProfile> = {};

    for (const id of ids) {
        const passwords = TestingPasswords.profiles as Record<string, any>;
        const password: string = passwords[id]?.password;

        const profileData = { id, ...fixtureProfiles[id] };
        let data = Base64.encode(JSON.stringify(profileData));

        const profile = await env.profiles().import(data);
        await env.profiles().restore(profile);

        if (password) {
            // Re-import profile as passwordless, reset password and dump encrypted data.
            delete profileData.settings.password;

            profile.auth().setPassword(password);

            data = await env.profiles().export(profile, undefined, password);
        }

        profiles[id] = profile;

        storageData.profiles[id] = {
            data,
            id,
            name: fixtureProfiles[id].settings.NAME,
            password: fixtureProfiles[id].settings.PASSWORD,
        };
    }

    await env.verify(storageData);

    if (shouldRestoreDefaultProfile) {
        const defaultProfile = profiles[ids[0]];

        env.profiles().push(defaultProfile);

        await defaultProfile.sync();
    }

    return profiles;
};

export const isUnit = () =>
    !!['true', '1'].includes(process.env.REACT_APP_IS_UNIT?.toLowerCase() || '');
