import { IReadWriteWallet } from '@ardenthq/sdk-profiles/distribution/esm/wallet.contract';
import { useEffect, useState } from 'react';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';
import { TransactionType } from '@/components/home/LatestTransactions.blocks';

export const useDelegateInfo = (
    transaction: ExtendedConfirmedTransactionData,
    type: string,
    primaryWallet?: IReadWriteWallet,
) => {
    const { env } = useEnvironmentContext();
    const { profile } = useProfileContext();
    const [delegateName, setDelegateName] = useState<string>('');

    const votingTypes = [TransactionType.VOTE, TransactionType.UNVOTE, TransactionType.SWAP];

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
            if (votingTypes.includes(type as TransactionType)) {
                const delegateName = await getDelegateName(
                    transaction.votes()[0] || transaction.unvotes()[0] || '',
                );

                setDelegateName(delegateName);
            }
        })();
    }, [transaction, primaryWallet]);

    return { delegateName };
};
