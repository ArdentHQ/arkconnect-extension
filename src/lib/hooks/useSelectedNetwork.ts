import {useLocation} from "react-router-dom";
import {WalletNetwork} from "@/lib/store/wallet";

export const useSelectedNetwork = () => {
    const { state } = useLocation();

    console.log('using network:', state?.isTestnet ? WalletNetwork.DEVNET : WalletNetwork.MAINNET)

    return state?.isTestnet ? WalletNetwork.DEVNET : WalletNetwork.MAINNET;
}
