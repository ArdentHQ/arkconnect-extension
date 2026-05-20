import constants from '@/constants';
import { Network } from '@/lib/mainsail/network';

export const networkDisplayName = (network: Network | undefined | null) => {
    if (!network) {
        return '';
    }

    return network.displayName() === 'ARK Devnet' ? 'Testnet' : network.displayName();
};
