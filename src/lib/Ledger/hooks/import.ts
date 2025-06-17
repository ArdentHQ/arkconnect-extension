import { useCallback } from 'react';
import { LedgerDevice } from './connection.state';
import { Contracts, Environment } from '@/lib/profiles';
import { LedgerData } from '@/lib/Ledger/Ledger.contracts';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';

interface LedgerWalletImportProperties {
    device?: LedgerDevice;
    env: Environment;
}

export const useLedgerImport = ({ device, env }: LedgerWalletImportProperties) => {
    const { onError } = useErrorHandlerContext();

    const importLedgerWallets = useCallback(
        async (wallets: LedgerData[], profile: Contracts.IProfile) => {
            const importedWallets = await Promise.all(
                wallets.map(async ({ address, path }) => {
                    try {
                        const wallet = await profile.walletFactory().fromAddressWithDerivationPath({
                            address,
                            path,
                        });

                        profile.wallets().push(wallet);

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
