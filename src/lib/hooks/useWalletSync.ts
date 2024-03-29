import { Contracts, Environment } from '@ardenthq/sdk-profiles';

interface WalletImportTypes {
    profile: Contracts.IProfile;
    env: Environment;
}

const syncBalance = async (wallet: Contracts.IReadWriteWallet) => wallet.synchroniser().identity();

const useWalletSync = ({ profile, env }: WalletImportTypes) => {
    const syncFees = async (wallet: Contracts.IReadWriteWallet) => {
        const network = wallet.network();
        try {
            env.fees().all(network.coin(), network.id());
        } catch {
            // Sync network fees for the first time
            await env.fees().sync(profile, network.coin(), network.id());
        }
    };

    const syncRates = async (profile: Contracts.IProfile, wallet: Contracts.IReadWriteWallet) => {
        await Promise.all([
            env.exchangeRates().syncAll(profile, wallet.currency()),
            env.exchangeRates().syncAll(profile, wallet.exchangeCurrency()),
        ]);
    };

    const syncVotes = async (wallet: Contracts.IReadWriteWallet) => {
        const network = wallet.network();

        if (network.allowsVoting()) {
            try {
                env.delegates().all(network.coin(), network.id());
            } catch {
                // Sync network delegates for the first time
                await env.delegates().sync(profile, network.coin(), network.id());
            }

            if (wallet.hasSyncedWithNetwork()) {
                await wallet.synchroniser().votes();
            }
        }
    };

    const syncAll = async (wallet: Contracts.IReadWriteWallet) =>
        Promise.allSettled([
            syncVotes(wallet),
            syncRates(profile, wallet),
            syncFees(wallet),
            syncBalance(wallet),
        ]);

    return { syncAll };
};

export default useWalletSync;
