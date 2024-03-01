import {useLocation} from "react-router-dom";
import {WalletNetwork} from "@/lib/store/wallet";
import {useProfileContext} from "@/lib/context/Profile";

const useActiveNetwork = ()=> {
    const { profile } = useProfileContext();

    const { state } = useLocation();

    const selectedNetwork = state?.isTestnet ? WalletNetwork.DEVNET : WalletNetwork.MAINNET;

    const networks = profile.availableNetworks();

    return networks.find((n) => n.name() === selectedNetwork) || networks[0];
};

export default useActiveNetwork;
