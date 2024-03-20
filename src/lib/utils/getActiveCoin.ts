import { Networks } from '@ardenthq/sdk';
import { WalletNetwork } from '@/lib/store/wallet';

const getActiveCoin = (network?: WalletNetwork) => {
    if (!network) return 'ARK';
    return network === WalletNetwork.DEVNET ? 'DARK' : 'ARK';
};

export const getNetworkCurrency = (network: Networks.Network) => {
    return network.displayName() === 'ARK Devnet' ? 'DARK' : 'ARK';
};

export default getActiveCoin;
