import { Contracts, Environment } from '@ardenthq/sdk-profiles';
import { useCallback, useMemo, useState } from 'react';

export const useDelegates = ({
    env,
    profile,
    searchQuery,
}: {
    env: Environment;
    profile: Contracts.IProfile;
    searchQuery: string;
}) => {
    const [allDelegates, setAllDelegates] = useState<Contracts.IReadOnlyWallet[]>([]);
    const [isLoadingDelegates, setIsLoadingDelegates] = useState(false);

    const fetchDelegates = useCallback(
        async (wallet: Contracts.IReadWriteWallet) => {
            setIsLoadingDelegates(true);

            await env.delegates().sync(profile, wallet.coinId(), wallet.networkId());

            const delegates = env.delegates().all(wallet.coinId(), wallet.networkId());

            setAllDelegates(delegates);

            setIsLoadingDelegates(false);
        },
        [env, profile],
    );

    const delegates = useMemo(() => {
        if (searchQuery.length === 0) {
            return allDelegates;
        }

        const query = searchQuery.toLowerCase();

        return allDelegates.filter(
            (delegate) =>
                delegate.address().toLowerCase().includes(query) ||
                delegate.username()?.toLowerCase()?.includes(query),
        );
    }, [allDelegates, searchQuery]);

    return {
        delegates,
        fetchDelegates,
        isLoadingDelegates,
    };
};
