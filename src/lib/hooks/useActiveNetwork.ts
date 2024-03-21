import { useLocation } from 'react-router-dom';
import { WalletNetwork } from '@/lib/store/wallet';
import { useProfileContext } from '@/lib/context/Profile';
import { LastVisitedPage, ProfileData } from '@/lib/background/contracts';

const useActiveNetwork = () => {
    const { profile } = useProfileContext();

    const { state } = useLocation();

    const networks = profile.availableNetworks();

    let selectedNetwork = WalletNetwork.MAINNET;

    const lastVisitedPage = profile.settings().get(ProfileData.LastVisitedPage) as
        | LastVisitedPage
        | undefined;

    if (lastVisitedPage && lastVisitedPage.data.network) {
        selectedNetwork =
            lastVisitedPage.data.network === 'ark.devnet'
                ? WalletNetwork.DEVNET
                : WalletNetwork.MAINNET;
    }

    if (state?.isTestnet) {
        selectedNetwork = WalletNetwork.DEVNET;
    }

    if (profile.wallets().count() === 0) {
        selectedNetwork = WalletNetwork.MAINNET;
    }

    return networks.find((n) => n.name() === selectedNetwork) || networks[0];
};

export default useActiveNetwork;
