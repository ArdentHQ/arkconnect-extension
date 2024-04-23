import { Networks } from '@ardenthq/sdk';
import constants from '@/constants';

export const networkDisplayName = (network: Networks.Network | undefined | null) => {
    if (!network) {
        return '';
    }

    return network.displayName() === 'ARK Devnet' ? 'Testnet' : network.displayName();
};

export const getExplorerDomain = (isLiveNetwork: boolean, address: string) => {
    return isLiveNetwork
        ? `${constants.ARKSCAN_ADDRESSES}/${address}`
        : `${constants.ARKSCAN_TEST_ADDRESSES}/${address}`;
};

export const getTransactionDetailLink = (isLiveNetwork: boolean, transactionId: string) => {
    return isLiveNetwork
        ? `${constants.ARKSCAN_MAINNET_TRANSACTIONS}/${transactionId}`
        : `${constants.ARKSCAN_TESTNET_TRANSACTIONS}/${transactionId}`;
};
