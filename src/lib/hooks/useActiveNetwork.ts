import {useLocation} from 'react-router-dom';
import {WalletNetwork} from '@/lib/store/wallet';
import {useProfileContext} from '@/lib/context/Profile';
import {getPersistedValues} from "@/components/wallet/form-persist";

const useActiveNetwork = () => {
    const { profile } = useProfileContext();

    const { state } = useLocation();

    const {persistScreen} = getPersistedValues();

    const networks = profile.availableNetworks();

    let selectedNetwork = WalletNetwork.MAINNET;

    if (persistScreen && persistScreen?.step > 0) {
       selectedNetwork = persistScreen.networkName === WalletNetwork.MAINNET ? WalletNetwork.MAINNET : WalletNetwork.DEVNET;
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
