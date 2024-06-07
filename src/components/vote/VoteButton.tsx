import { useTranslation } from 'react-i18next';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useMemo } from 'react';
import { Button } from '@/shared/components';
import { Footer } from '@/shared/components/layout/Footer';

export const VoteButton = ({
    delegateAddress,
    fee,
    votes,
    onClick,
    isValid,
}: {
    delegateAddress?: string;
    fee: string;
    votes: Contracts.VoteRegistryItem[];
    onClick: () => void;
    isValid: boolean;
}) => {
    // @TODO: disable if empty fee
    const disabled = !isValid || delegateAddress === undefined || fee === '';

    const isVoted = useMemo(() => {
        if (delegateAddress === undefined) {
            return false;
        }

        return votes.some((vote) => vote.wallet?.address() === delegateAddress);
    }, [votes, delegateAddress]);

    const isSwapping = useMemo(() => votes.length > 0 && !isVoted, [votes, isVoted]);

    const isVoting = useMemo(() => votes.length === 0 && !isVoted, [votes, isVoted]);

    const { t } = useTranslation();

    const voteText = useMemo(() => {
        if (isVoting || disabled) {
            return t('COMMON.VOTE');
        }

        if (isSwapping) {
            return t('COMMON.SWAP_VOTE');
        }

        return t('COMMON.UNVOTE');
    }, [disabled, isSwapping, isVoting]);

    return (
        <Footer className='h-[84px]'>
            <Button variant='primary' disabled={disabled} onClick={onClick}>
                {voteText}
            </Button>
        </Footer>
    );
};
