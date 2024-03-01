import { Contracts, Environment } from '@ardenthq/sdk-profiles';
import { initializeEnvironment } from '../utils/env.background';
import { LockHandler } from './handleAutoLock';
import { PrimaryWallet } from './extension.wallet.primary';

const exists = (profile?: Contracts.IProfile | null): profile is Contracts.IProfile => !!profile;

export const env = initializeEnvironment();

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
                profileData: profile.data().all(),
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

            env.profiles().flush();

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
    };
}
