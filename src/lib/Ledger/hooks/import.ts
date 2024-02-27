import { Coins } from '@ardenthq/sdk';
import { Contracts, Environment } from '@ardenthq/sdk-profiles';
import { useCallback } from 'react';
import { LedgerData } from '../Ledger.contracts';
import { LedgerDevice } from './connection.state';
import { getDefaultAlias } from '@/lib/utils/getDefaultAlias';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';

interface LedgerWalletImportProperties {
    device?: LedgerDevice;
    env: Environment;
}

export const useLedgerImport = ({ device, env }: LedgerWalletImportProperties) => {
    const { onError } = useErrorHandlerContext();

    const importLedgerWallets = useCallback(
        async (wallets: LedgerData[], coin: Coins.Coin, profile: Contracts.IProfile) => {
            const importedWallets = await Promise.all(
                wallets.map(async ({ address, path }) => {
                    try {
                        const wallet = await profile.walletFactory().fromAddressWithDerivationPath({
                            address,
                            coin: coin.network().coin(),
                            network: coin.network().id(),
                            path,
                        });

                        profile.wallets().push(wallet);

                        wallet.mutator().alias(
                            getDefaultAlias({
                                network: wallet.network(),
                                profile,
                            }),
                        );

                        wallet.data().set(Contracts.WalletData.LedgerModel, device?.id);

                        return wallet;
                    } catch (error) {
                        onError(error);
                    }
                }),
            );

            return importedWallets;
        },
        [env, device],
    );

    return { importLedgerWallets };
};
