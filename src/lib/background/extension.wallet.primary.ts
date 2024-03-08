import { Contracts } from '@ardenthq/sdk-profiles';
import { Wallet } from './extension.wallet';

export function PrimaryWallet({ profile }: { profile: Contracts.IProfile }) {
    return {
        /**
         * Returns the primary wallet id that exists in profile data.
         *
         * @returns {string | undefined}
         */
        id(): string | undefined {
            return profile
                .wallets()
                .values()
                .find((wallet: Contracts.IReadWriteWallet) => wallet.isPrimary())
                ?.id();
        },
        /**
         * Determines whether a primary wallet exists in profile.
         *
         * @returns {boolean}
         */
        exists(): boolean {
            return !!this.id();
        },
        /**
         * Returns the Wallet instance of the primary wallet.
         *
         * @returns {Contracts.IReadWriteWallet | undefined}
         */
        wallet(): ReturnType<typeof Wallet> {
            const wallet = profile
                .wallets()
                .values()
                .find((wallet: Contracts.IReadWriteWallet) => wallet.isPrimary());

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
            if (!profile.wallets().has(id)) {
                throw new Error('WALLET_NOT_FOUND');
            }

            for (const wallet of profile.wallets().values()) {
                if (wallet.id() === id) {
                    wallet.data().set(Contracts.WalletData.IsPrimary, true);
                    continue;
                }

                wallet.data().set(Contracts.WalletData.IsPrimary, false);
            }
        },
        /**
         *  Sets the first wallet as primary, if it exists.
         *
         * @returns {void}
         */
        reset(): void {
            if (profile.wallets().count() > 0) {
                this.set(profile.wallets().first().id());
            }
        },
    };
}
