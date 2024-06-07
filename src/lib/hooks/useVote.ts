import { useTranslation } from 'react-i18next';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useMemo } from 'react';

export const useVote = ({
    delegateAddress,
    fee,
    votes,
    isValid,
}: {
    delegateAddress?: string;
    fee: string;
    votes: Contracts.VoteRegistryItem[];
    isValid: boolean;
}) => {
    const disabled = !isValid || delegateAddress === undefined || fee === '';

    const currentlyVotedAddress = useMemo(() => {
        return votes[0]?.wallet?.address();
    }, [votes, delegateAddress]);

    const isVoted = useMemo(() => {
        if (delegateAddress === '') {
            return false;
        }

        return votes.some((vote) => vote.wallet?.address() === delegateAddress);
    }, [votes, delegateAddress]);

    const isSwapping = useMemo(
        () => !disabled && votes.length > 0 && !isVoted,
        [votes, isVoted, disabled],
    );

    const isVoting = useMemo(
        () => !disabled && votes.length === 0 && !isVoted,
        [votes, isVoted, disabled],
    );

    const isUnvoting = useMemo(
        () => !isVoting && !isSwapping && !disabled,
        [isVoting, isSwapping, disabled],
    );

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
