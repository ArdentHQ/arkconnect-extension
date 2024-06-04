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
    const [delegates, setDelegates] = useState<Contracts.IReadOnlyWallet[]>();
    const [votes, setVotes] = useState<Contracts.VoteRegistryItem[]>();

    const fetchVotes = useCallback(
        (address: string, network: string) => {
            const wallet = profile.wallets().findByAddressWithNetwork(address, network);

            assertWallet(wallet);

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
    }, [votes, delegates]);

    const fetchDelegates = useCallback(
        async (wallet: Contracts.IReadWriteWallet) => {
            await env.delegates().sync(profile, wallet.coinId(), wallet.networkId());

            const delegates = env.delegates().all(wallet.coinId(), wallet.networkId());

            setDelegates(delegates);
        },
        [env, profile],
    );
    return {
        delegates: delegates ?? [],
        fetchDelegates,
        fetchVotes,
        isLoadingDelegates: delegates === undefined || votes === undefined,
        currentVotes,
    };
};
