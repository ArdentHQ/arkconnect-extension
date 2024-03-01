import { Networks } from '@ardenthq/sdk';
import { useProfileContext } from '../context/Profile';
import { profileAllEnabledNetworks } from '../utils/networkUtils';
import {useSelectedNetwork} from "@/lib/hooks/useSelectedNetwork";

type UseNetwork = {
    activeNetwork: Networks.Network;
    networks: Networks.Network[];
};

const useNetwork = (): UseNetwork => {
    const { profile } = useProfileContext();
    const networks = profileAllEnabledNetworks(profile);

    const selectedNetwork = useSelectedNetwork();

    const activeNetwork =
        networks.find((n) => n.name() === selectedNetwork) || networks[0];

    return {
        activeNetwork,
        networks,
    };
};

export default useNetwork;
