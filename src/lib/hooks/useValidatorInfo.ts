import { useEffect, useState } from 'react';

import { ExtendedConfirmedTransactionData } from '@/lib/profiles/transaction.dto';
import { IReadWriteWallet } from '@/lib/profiles/wallet.contract';
import { useProfileContext } from '@/lib/context/Profile';

export const useValidatorInfo = (
    transaction: ExtendedConfirmedTransactionData,
    primaryWallet?: IReadWriteWallet,
) => {
    const { profile } = useProfileContext();
    const [voteValidator, setVoteValidator] = useState<{
        name: string;
        address: string;
    }>({ name: '', address: '' });
    const [unvoteValidator, setUnvoteValidator] = useState<{
        name: string;
        address: string;
    }>({ name: '', address: '' });

    const getValidatorInfo = async (
        address: string,
    ): Promise<{
        name: string;
        address: string;
    }> => {
        let name = '',
            validatorAddress = '';
        const network = primaryWallet?.network().id() ?? 'mainsail.mainnet';
        try {
            profile.validators().all(network);
        } catch {
            await profile.validators().sync(profile, network);
        }

        const validator = profile.validators().findByAddress(network, address) || undefined;

        if (validator) {
            name = validator.username() || '';
            validatorAddress = validator.address();
        }

        return { name, address: validatorAddress };
    };

    useEffect(() => {
        (async () => {
            if (transaction.isVote() || transaction.isUnvote() || transaction.isVoteCombination()) {
                const voteAddress = transaction.votes()[0] || undefined;
                const unvoteAddress = transaction.unvotes()[0] || undefined;

                if (voteAddress) {
                    const voteValidator = await getValidatorInfo(voteAddress);

                    setVoteValidator(voteValidator);
                }

                if (unvoteAddress) {
                    const unvoteValidator = await getValidatorInfo(unvoteAddress);

                    setUnvoteValidator(unvoteValidator);
                }
            }
        })();
    }, [transaction, primaryWallet]);

    return { voteValidator, unvoteValidator };
};
