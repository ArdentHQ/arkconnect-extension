import { Contracts, Environment } from '@ardenthq/sdk-profiles';
import { useCallback, useMemo, useState } from 'react';
import useWalletSync from './useWalletSync';

export const useDelegates = ({
    env,
    profile,
    searchQuery,
    limit,
}: {
    env: Environment;
    profile: Contracts.IProfile;
    searchQuery: string;
    limit: number;
}) => {
    const [allDelegates, setAllDelegates] = useState<Contracts.IReadOnlyWallet[]>([]);
    const [votes, setVotes] = useState<Contracts.VoteRegistryItem[]>();
    const [isLoadingDelegates, setIsLoadingDelegates] = useState(false);
    const { syncAll } = useWalletSync({ env, profile });

    const fetchDelegates = useCallback(
        async (wallet: Contracts.IReadWriteWallet) => {
            setIsLoadingDelegates(true);

            await env.delegates().sync(profile, wallet.coinId(), wallet.networkId());

            const allDelegates = env
                .delegates()
                .all(wallet.coinId(), wallet.networkId())
                .filter((delegate) => !delegate.isResignedDelegate());

            setAllDelegates(allDelegates);

            setIsLoadingDelegates(false);
        },
        [env, profile],
    );

    const delegates = useMemo(() => {
        if (searchQuery.length === 0) {
            return allDelegates.slice(0, limit);
        }

        const query = searchQuery.toLowerCase();

        return allDelegates
            .filter(
                (delegate) =>
                    delegate.address().toLowerCase().includes(query) ||
                    delegate.username()?.toLowerCase()?.includes(query),
            )
            .slice(0, limit);
    }, [allDelegates, searchQuery, limit]);

    const fetchVotes = useCallback(
        async (wallet: Contracts.IReadWriteWallet) => {
            await syncAll(wallet);

            let votes: Contracts.VoteRegistryItem[];

            try {
                votes = wallet.voting().current();
            } catch {
                votes = [];
            }

            setVotes(votes);
        },
        [profile],
    );

    const currentVotes = useMemo(() => {
        if (votes === undefined || delegates === undefined) {
            return [];
        }

        return votes.filter((vote) =>
            delegates.some((delegate) => vote.wallet?.address() === delegate.address()),
        );
    }, [votes, allDelegates]);

    return {
        delegates: delegates ?? [],
        fetchDelegates,
        fetchVotes,
        isLoadingDelegates: isLoadingDelegates || votes === undefined,
        currentVotes,
    };
};
