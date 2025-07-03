import { useProfileContext } from '@/lib/context/Profile';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { assertNetwork } from '@/lib/utils/assertions';
import { Contracts } from '@/lib/profiles';

const useActiveNetwork = () => {
    const { profile } = useProfileContext();

    const environment = useEnvironmentContext();
    const activeNetwork = profile.activeNetwork();

    assertNetwork(activeNetwork);

    const setActiveNetwork = async (activeNetworkId: string) => {
        const dashboardConfiguration = profile
            .settings()
            .get(Contracts.ProfileSetting.DashboardConfiguration, {});
        profile.settings().set(Contracts.ProfileSetting.DashboardConfiguration, {
            ...dashboardConfiguration,
            activeNetworkId,
        });

        await environment.persist();
    };

    const resetToDefaults = async () => {
        const defaultNetwork = profile.availableNetworks().find((network) => network.isTest());
        if (defaultNetwork) {
            await setActiveNetwork(defaultNetwork.id());
        }
    };

    return {
        activeNetwork,
        resetToDefaults,
        setActiveNetwork,
    };
};

export default useActiveNetwork;
