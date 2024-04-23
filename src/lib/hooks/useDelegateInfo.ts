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
    const [voteDelegate, setVoteDelegate] = useState<string>('');
    const [unvoteDelegate, setUnvoteDelegate] = useState<string>('');

    const getDelegateName = async (address: string) => {
        const coin = primaryWallet?.network().coin() ?? 'ARK';
        const network = primaryWallet?.network().id() ?? 'ark.mainnet';
        try {
            env.delegates().all(coin, network);
        } catch {
            await env.delegates().sync(profile, coin, network);
        }

        const delegateName =
            env.delegates().findByPublicKey(coin, network, address)?.username() ?? '';

        return delegateName;
    };

    useEffect(() => {
        (async () => {
            if (transaction.isVote() || transaction.isUnvote() || transaction.isVoteCombination()) {
                const voteAddress = transaction.votes()[0] || undefined;
                const unvoteAddress = transaction.unvotes()[0] || undefined;

                if (voteAddress) {
                    const voteDelegateName = await getDelegateName(voteAddress);

                    setVoteDelegate(voteDelegateName);
                }

                if (unvoteAddress) {
                    const unvoteDelegateName = await getDelegateName(unvoteAddress);

                    setUnvoteDelegate(unvoteDelegateName);
                }
            }
        })();
    }, [transaction, primaryWallet]);

    return { voteDelegate, unvoteDelegate };
};
