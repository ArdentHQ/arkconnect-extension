import { Contracts } from '@ardenthq/sdk-profiles';
import { Networks } from '@ardenthq/sdk';
import constants from '@/constants';

const isCustomNetwork = (network: Networks.NetworkManifest | Networks.Network): boolean => {
  if (typeof network.id === 'function') {
    return network.id().endsWith('.custom');
  }

  return network.id.endsWith('.custom');
};

export const networkDisplayName = (network: Networks.Network | undefined | null) => {
  if (!network) {
    return '';
  }

  if (isCustomNetwork(network)) {
    return network.coinName();
  }

  return network.displayName() === 'ARK Devnet' ? 'Testnet' : network.displayName();
};

export const profileAllEnabledNetworks = (profile: Contracts.IProfile) =>
  profile.availableNetworks().filter((network) => {
    if (isCustomNetwork(network)) {
      return network.meta().enabled;
    }

    return true;
  });

export const getExplorerDomain = (isLiveNetwork: boolean, address: string) => {
  return isLiveNetwork
    ? `${constants.ARKSCAN_ADDRESSES}/${address}`
    : `${constants.ARKSCAN_TEST_ADDRESSES}/${address}`;
};
