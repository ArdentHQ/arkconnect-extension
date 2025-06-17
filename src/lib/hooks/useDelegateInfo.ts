import { useEffect, useState } from 'react';
import { useProfileContext } from '@/lib/context/Profile';
import { ExtendedConfirmedTransactionData } from '@/lib/profiles/transaction.dto';
import { IReadWriteWallet } from '@/lib/profiles/wallet.contract';

export const useDelegateInfo = (
    transaction: ExtendedConfirmedTransactionData,
    primaryWallet?: IReadWriteWallet,
) => {
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
        const network = primaryWallet?.network().id() ?? 'ark.mainnet';
        try {
            profile.validators().all(network);
        } catch {
            await profile.validators().sync(profile, network);
        }

        const delegate = profile.validators().findByPublicKey(network, address) || undefined;

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
