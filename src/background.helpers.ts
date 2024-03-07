import { Contracts } from '@ardenthq/sdk-profiles';
import { WalletData } from './lib/background/contracts';

interface WalletEntry {
    address: string;
    alias?: string;
    network: string;
    coin: string;
    path?: string;
    mnemonic?: string;
}

const importWallet = async ({
    profile,
    wallet,
}: {
    profile: Contracts.IProfile;
    wallet: WalletEntry;
}) => {
    if (wallet.path) {
        return await profile.walletFactory().fromAddressWithDerivationPath({
            address: wallet.address,
            network: wallet.network,
            coin: wallet.coin,
            path: wallet.path,
        });
    }

    return await profile.walletFactory().fromAddress({
        address: wallet.address,
        network: wallet.network,
        coin: wallet.coin,
    });
};

export const importWallets = async ({
    profile,
    wallets,
}: {
    profile: Contracts.IProfile;
    wallets: WalletEntry[];
}) => {
    for (const wallet of wallets) {
        const existingWallet = profile
            .wallets()
            .findByAddressWithNetwork(wallet.address, wallet.network);

        const isExistingPrimary = existingWallet?.isPrimary();

        // If the wallet exists, remove it so that it will be re-imported with fresh data.
        if (existingWallet) {
            profile.wallets().forget(existingWallet.id());
        }

        const importedWallet = await importWallet({ profile, wallet });
        importedWallet.data().set(WalletData.IsPrimary, isExistingPrimary);

        if (wallet.alias) {
            importedWallet.settings().set(Contracts.WalletSetting.Alias, wallet.alias);
        }

        if (wallet.mnemonic) {
            importedWallet.confirmKey().set(wallet.mnemonic, profile.password().get());
        }

        profile.wallets().push(importedWallet);
    }

    const primaryWallet = profile
        .wallets()
        .values()
        .find((wallet: Contracts.IReadWriteWallet) => wallet.isPrimary());

    if (!primaryWallet) {
        profile.wallets().first().data().set(WalletData.IsPrimary, true);
    }

    return {
        error: null,
    };
};
