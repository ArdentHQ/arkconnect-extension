import { Networks } from '@ardenthq/sdk';
import { useProfileContext } from '../context/Profile';
import { profileAllEnabledNetworks } from '../utils/networkUtils';
import { useAppSelector } from '../store';
import * as UIStore from '@/lib/store/ui';

type UseNetwork = {
  activeNetwork: Networks.Network;
  networks: Networks.Network[];
};

const useNetwork = (): UseNetwork => {
  const { profile } = useProfileContext();
  const networks = profileAllEnabledNetworks(profile);
  const testNetEnabled = useAppSelector(UIStore.selectTestnetEnabled);

  const activeNetwork =
    networks.find((n) => n.name() === (testNetEnabled ? 'Devnet' : 'Mainnet')) || networks[0];

  return {
    activeNetwork,
    networks,
  };
};

export default useNetwork;
