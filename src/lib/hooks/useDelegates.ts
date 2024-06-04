import { Contracts, Environment } from '@ardenthq/sdk-profiles';
import { useCallback, useMemo, useState } from 'react';
import { assertWallet } from '@/lib/utils/assertions';

export const useDelegates = ({
    env,
    profile,
}: {
    env: Environment;
    profile: Contracts.IProfile;
}) => {
    const [delegates, setDelegates] = useState<Contracts.IReadOnlyWallet[]>([]);
    const [isLoadingDelegates, setIsLoadingDelegates] = useState(false);
    const [votes, setVotes] = useState<Contracts.VoteRegistryItem[]>([]);

    const fetchVotes = useCallback(
        (address: string, network: string) => {
            const wallet = profile.wallets().findByAddressWithNetwork(address, network);

            assertWallet(wallet);
            console.log(wallet.voting().current());

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

    const currentVotes = useMemo(
        () =>
            votes.filter((vote) =>
                delegates.some((delegate) => vote.wallet?.address() === delegate.address()),
            ),
        [votes, delegates],
    );

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
        fetchVotes,
        isLoadingDelegates,
        currentVotes,
    };
};
