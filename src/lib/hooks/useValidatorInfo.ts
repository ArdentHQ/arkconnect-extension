import { useEffect, useState } from 'react';
import { useProfileContext } from '@/lib/context/Profile';
import { ExtendedConfirmedTransactionData } from '@/lib/profiles/transaction.dto';
import { IReadWriteWallet } from '@/lib/profiles/wallet.contract';

export const useValidatorInfo = (
    transaction: ExtendedConfirmedTransactionData,
    primaryWallet?: IReadWriteWallet,
) => {
    const { profile } = useProfileContext();
    const [voteValidator, setVoteValidator] = useState<{
        name: string | undefined;
        address: string;
    }>({ name: undefined, address: '' });
    const [unvoteValidator, setUnvoteValidator] = useState<{
        name: string | undefined;
        address: string;
    }>({ name: undefined, address: '' });

    const getValidatorInfo = async (
        address: string,
    ): Promise<{
        name: string | undefined;
        address: string;
    }> => {
        let name: string | undefined = undefined;
        let validatorAddress = '';

        const network = primaryWallet?.network().id() ?? 'mainsail.mainnet';
        try {
            profile.validators().all(network);
        } catch {
            await profile.validators().sync(profile, network);
        }

        const validator = profile.validators().findByAddress(network, address) || undefined;

        if (validator) {
            name = validator.username();
            validatorAddress = validator.address();
        }

        return { name, address: validatorAddress };
    };

    useEffect(() => {
        (async () => {
            if (transaction.isVote()) {
                const voteAddress = transaction.votes()[0] || undefined;

                if (voteAddress) {
                    const voteValidator = await getValidatorInfo(voteAddress);

                    setVoteValidator(voteValidator);
                }
            }

            if (transaction.isUnvote()) {
                const unvoteAddress = transaction.unvotes()[0] || undefined;

                if (unvoteAddress) {
                    const unvoteValidator = await getValidatorInfo(unvoteAddress);

                    setUnvoteValidator(unvoteValidator);
                }
            }
        })();
    }, [transaction, primaryWallet]);

    return { voteValidator, unvoteValidator };
};
