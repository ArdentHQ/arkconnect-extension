import { Contracts } from '@ardenthq/sdk-profiles';
import { ProfileData } from './contracts';
import { Wallet } from './extension.wallet';

export function PrimaryWallet({ profile }: { profile: Contracts.IProfile | null }) {
    return {
        /**
         * Returns the primary wallet id that exists in profile data.
         *
         * @returns {string | undefined}
         */
        id(): string | undefined {
            return profile?.data().get(ProfileData.PrimaryWalletId);
        },
        /**
         * Determines whether a primary wallet exists in profile.
         *
         * @returns {boolean}
         */
        exists(): boolean {
            const id = this.id();

            if (!id) {
                return false;
            }

            return profile?.wallets().has(id) ?? false;
        },
        /**
         * Returns the Wallet instance of the primary wallet.
         *
         * @returns {Contracts.IReadWriteWallet | undefined}
         */
        wallet(): ReturnType<typeof Wallet> {
            const id = this.id();

            if (!id) {
                throw new Error('MISSING_PRIMARY_WALLET');
            }

            const wallet = profile?.wallets().findById(id);

            if (!wallet) {
                throw new Error('MISSING_PRIMARY_WALLET');
            }

            return Wallet({ wallet });
        },
        /**
         * Set the primary wallet wallet id for the profile.
         *
         * @param {string} id
         * @returns {void}
         */
        set(id: string): void {
            if (!profile?.wallets().has(id)) {
                throw new Error('WALLET_NOT_FOUND');
            }

            profile?.data().set(ProfileData.PrimaryWalletId, id);
        },
    };
}
