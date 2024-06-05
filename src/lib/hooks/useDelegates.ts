import { Contracts, Environment } from '@ardenthq/sdk-profiles';
import { useCallback, useState } from 'react';

export const useDelegates = ({
    env,
    profile,
}: {
    env: Environment;
    profile: Contracts.IProfile;
}) => {
    const [delegates, setDelegates] = useState<Contracts.IReadOnlyWallet[]>([]);
    const [isLoadingDelegates, setIsLoadingDelegates] = useState(false);

    const fetchDelegates = useCallback(
        async (wallet: Contracts.IReadWriteWallet) => {
            setIsLoadingDelegates(true);

            await env.delegates().sync(profile, wallet.coinId(), wallet.networkId());

            const delegates = env.delegates().all(wallet.coinId(), wallet.networkId());

            setDelegates(delegates);

            setIsLoadingDelegates(false);
        },
        [env, profile],
    );
    return {
        delegates,
        fetchDelegates,
        isLoadingDelegates,
    };
};
