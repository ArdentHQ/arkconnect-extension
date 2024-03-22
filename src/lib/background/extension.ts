import { Contracts, Environment } from '@ardenthq/sdk-profiles';

import { LockHandler } from './handleAutoLock';
import { PrimaryWallet } from './extension.wallet.primary';
import { EnvironmentData } from './contracts';
import { initializeEnvironment } from '@/lib/utils/env.background';
import { createTestProfile, isDev } from '@/dev/utils/dev';

const exists = (profile?: Contracts.IProfile | null): profile is Contracts.IProfile => !!profile;

export function Extension() {
    const env = initializeEnvironment();

    const lockHandler = new LockHandler();

    return {
        /**
         * Determines whether the extension is in locked state.
         * Can happen when password does not exist or is removed from memory.
         *
         * @returns {boolean}
         */
        isLocked(): boolean {
            if (!exists(this.profile())) {
                return false;
            }

            return lockHandler.isLocked();
        },
        /**
         * Returns the Primary wallet service.
         *
         * @returns {ReturnType<typeof PrimaryWallet>}
         */
        primaryWallet(): ReturnType<typeof PrimaryWallet> {
            return PrimaryWallet({ profile: this.profile() });
        },
        /**
         * Throws an exception if profile is locked.
         *
         * @returns {void}
         */
        assertLockedStatus(): void {
            if (this.isLocked()) {
                throw new Error('LOCKED');
            }
        },
        /**
         * Throws an exception if profile doesn't have a primary wallet.
         *
         * @returns {void}
         */
        assertPrimaryWallet(): void {
            if (!this.primaryWallet().exists()) {
                throw new Error('MISSING_PRIMARY_WALLET');
            }
        },
        /**
         * Exports the profile wallets & data as a read-only password.
         */
        async exportAsReadOnly() {
            const profile = this.profile();
            if (!this.exists()) {
                throw new Error('MISSING_PROFILE');
            }

            const password = profile.password().get();

            if (!profile.status().isRestored()) {
                await env.profiles().restore(profile, password);
            }

            await env.wallets().syncByProfile(profile);

            profile.auth().forgetPassword(password);

            const readOnlyData = await env.profiles().export(profile);

            profile.auth().setPassword(password);

            return {
                data: readOnlyData,
                envData: env.data().all(),
            };
        },
        /**
         * Reset a profile given a password and optional parameters like currency.
         *
         * @param {string} password
         * @param {Object} options
         */
        async reset(password?: string, options?: { currency: string }): Promise<void> {
            lockHandler.reset();

            if (!password) {
                throw new Error('MISSING_PASSWORD');
            }

            env.data().flush();
            env.profiles().flush();

            env.data().set(EnvironmentData.HasOnboarded, false);

            await env.persist();

            const profile = await env.profiles().create('arkconnect');
            profile.auth().setPassword(password);
            env.profiles().push(profile);

            profile
                .settings()
                .set(Contracts.ProfileSetting.ExchangeCurrency, options?.currency ?? 'USD');

            await env.verify();
            await env.boot();

            await env.persist();
        },
        /**
         * Returns the profile instance.
         *
         * @returns {Contracts.IProfile}
         */
        profile(): Contracts.IProfile {
            return env.profiles().first();
        },
        /**
         * Determines whether the profile exists.
         *
         * @returns {boolean}
         */
        exists(): boolean {
            return exists(this.profile());
        },
        /**
         * Persist changes to indexeddb.
         *
         * @returns {Promise<void>}
         */
        persist(): Promise<void> {
            return env.persist();
        },
        /**
         * Reset profile from dump.
         *
         * @param {profileDump} object
         * @param {password} string
         * @param {data} object
         * @returns {Promise<void>}
         */
        async resetFromDump(
            profileDump: Record<string, any>,
            password: string,
            data: Record<string, any>,
        ): Promise<void> {
            env.profiles().flush();
            env.profiles().fill(profileDump);

            await env.verify();
            await env.boot();

            const profile = env.profiles().first();
            await env.profiles().restore(profile, password);

            if (data) {
                profile.data().fill(data);
            }

            await env.persist();
        },
        /**
         * Returns the environment instance.
         *
         * @returns {Environment}
         */
        env(): Environment {
            return env;
        },
        /**
         * Returns the lock handler instance.
         */
        lockHandler() {
            return lockHandler;
        },
        /**
         * Create or restore existing stored profile.
         *
         * @returns {Promise<void>}
         */
        async boot(password?: string): Promise<void> {
            if (isDev()) {
                await createTestProfile({ env });
                return;
            }

            await env.verify();
            await env.boot();

            await this.runEnvMigrations();

            const hasOnboarded = env.data().get(EnvironmentData.HasOnboarded);

            if (this.exists() && hasOnboarded) {
                // If profile exists, it means that the extension was restarted.
                // Go to locked state and require password to unlock.
                return lockHandler.lock();
            }

            // First time extension loads. Create a fresh profile.
            await this.reset(password);
        },
        /**
         * Returns an empty profile.
         * The profile is not stored in env.profiles() repository.
         *
         * @returns {Promise<Contracts.IProfile>}
         */
        async createEmptyProfile(): Promise<Contracts.IProfile> {
            const emptyProfile = await env.profiles().create('empty');
            env.profiles().forget(emptyProfile.id());

            return emptyProfile;
        },
        /**
         * Unlocks extension.
         *
         * @param {string} password
         * @returns {Promise<void>}
         */
        async unlock(password?: string): Promise<void> {
            await env.profiles().restore(this.profile(), password);

            if (!this.primaryWallet().exists()) {
                this.primaryWallet().reset();
                await this.persist();
            }

            lockHandler.unlock(this.profile(), password);
        },
        /**
         * Triggers migrations by importing a temporary profile, specifically for environment-related migrations.
         * This method is used to initiate migrations related to environment updates, such as `env.data()`
         *
         * As sdk runs migrations only when importing a specific profile and stores the migration version in the profile itself,
         * there are migrations such as https://github.com/ArdentHQ/arkconnect-extension/blob/7e4ceeb30ef6e9ac42a572d31010f053d6f5ffbf/src/lib/utils/migrations/move-onboarded-status-to-env.ts#L6
         * that introduce the need to store data in env scope, and have the ability to run env level migrations expclicitly. See Extension#boot method above.
         *
         * @see https://github.com/ArdentHQ/platform-sdk/blob/6f567bafd64d6d051affafa1d61b735bc0a3c46e/packages/profiles/source/profile.importer.ts#L24
         *
         * @returns {Promise<void>}
         */
        async runEnvMigrations(): Promise<void> {
            const temporaryProfile = await env.profiles().create('temp');
            await env.profiles().import(await env.profiles().export(temporaryProfile));
            env.profiles().forget(temporaryProfile.id());
        },
    };
}
