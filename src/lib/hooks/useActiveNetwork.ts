import { useLocation } from 'react-router-dom';
import { WalletNetwork } from '@/lib/store/wallet';
import { useProfileContext } from '@/lib/context/Profile';

const useActiveNetwork = () => {
    const { profile } = useProfileContext();

    const { state } = useLocation();

    let selectedNetwork = state?.isTestnet ? WalletNetwork.DEVNET : WalletNetwork.MAINNET;

    if (profile?.wallets().count() === 0) {
        selectedNetwork = WalletNetwork.MAINNET;
    }

    console.log(selectedNetwork);

    const networks = profile?.availableNetworks();

    return networks.find((n) => n.name() === selectedNetwork) || networks[0];
};

export default useActiveNetwork;
