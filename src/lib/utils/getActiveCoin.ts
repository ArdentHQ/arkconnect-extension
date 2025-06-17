import { WalletNetwork } from '@/lib/store/wallet';
import { Network } from '@/lib/mainsail/network';

const getActiveCoin = (network?: WalletNetwork) => {
    if (!network) return 'ARK';
    return network === WalletNetwork.DEVNET ? 'DARK' : 'ARK';
};

export const getNetworkCurrency = (network: Network) => {
    return network.displayName() === 'ARK Devnet' ? 'DARK' : 'ARK';
};

export default getActiveCoin;
