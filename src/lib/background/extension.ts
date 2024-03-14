import { Contracts, Environment } from '@ardenthq/sdk-profiles';

import { initializeEnvironment } from '../utils/env.background';
import { LockHandler } from './handleAutoLock';
import { PrimaryWallet } from './extension.wallet.primary';
import { EnvironmentData } from './contracts';
import { createTestProfile, isDev } from '@/dev/utils/dev';

const exists = (profile?: Contracts.IProfile | null): profile is Contracts.IProfile => !!profile;

const env = initializeEnvironment();

export function Extension() {
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

            const hasOnboarded = await env.data().get(EnvironmentData.HasOnboarded);

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
    };
}
