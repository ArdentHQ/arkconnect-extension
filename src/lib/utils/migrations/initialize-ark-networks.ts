import { ARK } from '@ardenthq/sdk-ark';

export const initializeArkNetworks = ({ data }: any) => {
  if (typeof data.networks === 'object' && !!data.networks.ark) {
    // Networks already assigned to profile, skipping migration
    return;
  }

  if (!data.networks) {
    data.networks = {};
  }

  data.networks.ark = {
    mainnet: ARK.manifest.networks['ark.mainnet'],
    devnet: ARK.manifest.networks['ark.devnet'],
  };
};
