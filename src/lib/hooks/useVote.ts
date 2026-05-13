import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Contracts } from '@/lib/profiles';
import { BigNumber } from "../helpers";

export const useVote = ({
    validatorAddress,
    fee,
    votes,
    isValid,
}: {
    validatorAddress?: string;
    fee: BigNumber;
    votes: Contracts.VoteRegistryItem[];
    isValid: boolean;
}) => {
    const disabled = !isValid || validatorAddress === undefined || fee.isZero();

    const currentlyVotedAddress = useMemo(() => {
        return votes[0]?.wallet?.address();
    }, [votes, validatorAddress]);

    const isVoted = useMemo(() => {
        if (validatorAddress === '') {
            return false;
        }

        return votes.some((vote) => vote.wallet?.address() === validatorAddress);
    }, [votes, validatorAddress]);

    const isSwapping = !disabled && votes.length > 0 && !isVoted;

    const isVoting = !disabled && votes.length === 0 && !isVoted;

    const isUnvoting = !isVoting && !isSwapping && !disabled;

    const { t } = useTranslation();

    const actionLabel = useMemo(() => {
        if (isVoting || disabled) {
            return t('COMMON.VOTE');
        }

        if (isSwapping) {
            return t('COMMON.SWAP_VOTE');
        }

        return t('COMMON.UNVOTE');
    }, [disabled, isSwapping, isVoting]);

    return {
        disabled,
        isVoting,
        isSwapping,
        isUnvoting,
        actionLabel,
        currentlyVotedAddress,
    };
};
