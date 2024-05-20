import { IReadWriteWallet } from '@ardenthq/sdk-profiles/distribution/esm/wallet.contract';
import { useEffect, useState } from 'react';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';

export const useDelegateInfo = (
    transaction: ExtendedConfirmedTransactionData,
    primaryWallet?: IReadWriteWallet,
) => {
    const { env } = useEnvironmentContext();
    const { profile } = useProfileContext();
    const [voteDelegate, setVoteDelegate] = useState<{
        name: string;
        address: string;
    }>({ name: '', address: '' });
    const [unvoteDelegate, setUnvoteDelegate] = useState<{
        name: string;
        address: string;
    }>({ name: '', address: '' });

    const getDelegateInfo = async (
        address: string,
    ): Promise<{
        name: string;
        address: string;
    }> => {
        let name = '',
            delegateAddress = '';
        const coin = primaryWallet?.network().coin() ?? 'ARK';
        const network = primaryWallet?.network().id() ?? 'ark.mainnet';
        try {
            env.delegates().all(coin, network);
        } catch {
            await env.delegates().sync(profile, coin, network);
        }

        const delegate = env.delegates().findByPublicKey(coin, network, address) || undefined;

        if (delegate) {
            name = delegate.username() || '';
            delegateAddress = delegate.address();
        }

        return { name, address: delegateAddress };
    };

    useEffect(() => {
        (async () => {
            if (transaction.isVote() || transaction.isUnvote() || transaction.isVoteCombination()) {
                const voteAddress = transaction.votes()[0] || undefined;
                const unvoteAddress = transaction.unvotes()[0] || undefined;

                if (voteAddress) {
                    const voteDelegate = await getDelegateInfo(voteAddress);

                    setVoteDelegate(voteDelegate);
                }

                if (unvoteAddress) {
                    const unvoteDelegate = await getDelegateInfo(unvoteAddress);

                    setUnvoteDelegate(unvoteDelegate);
                }
            }
        })();
    }, [transaction, primaryWallet]);

    return { voteDelegate, unvoteDelegate };
};
