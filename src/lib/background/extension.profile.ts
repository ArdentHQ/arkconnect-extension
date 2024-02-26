import { Contracts, Environment } from '@ardenthq/sdk-profiles';
import { LockHandler } from './handleAutoLock';
import { PrimaryWallet } from './extension.wallet.primary';

const exists = (profile?: Contracts.IProfile | null): profile is Contracts.IProfile => !!profile;

export function ExtensionProfile({
  profile,
  env,
  lockHandler,
}: {
  profile: Contracts.IProfile | null;
  env: Environment;
  lockHandler: LockHandler;
}) {
  return {
    /**
     * Determines whether the extension is in locked state.
     * Can happen when password does not exist or is removed from memory.
     *
     * @returns {boolean}
     */
    isLocked(): boolean {
      if (!exists(profile)) {
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
      return PrimaryWallet({ profile });
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
      if (!exists(profile)) {
        throw new Error('MISSING_PROFILE');
      }

      const password = profile.password().get();
      await env.profiles().restore(profile, password);
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
    async reset(password?: string, options?: { currency: string }): Promise<Contracts.IProfile> {
      if (!password) {
        throw new Error('MISSING_PASSWORD');
      }

      env.profiles().flush();

      const profile = await env.profiles().create('arkconnect');
      env.profiles().push(profile);

      profile.auth().setPassword(password);
      profile.settings().set(Contracts.ProfileSetting.ExchangeCurrency, options?.currency ?? 'USD');

      await env.verify();
      await env.boot();

      return profile;
    },
  };
}
