import { useTranslation } from 'react-i18next';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useMemo } from 'react';
import { Button } from '@/shared/components';
import { Footer } from '@/shared/components/layout/Footer';

export const VoteButton = ({
    delegate,
    votes,
}: {
    delegate?: Contracts.IReadOnlyWallet;
    votes: Contracts.VoteRegistryItem[];
}) => {
    const disabled = delegate === undefined;

    const isVoted = useMemo(() => {
        if (delegate === undefined) {
            return false;
        }

        return votes.some((vote) => vote.wallet?.address() === delegate.address());
    }, [votes, delegate]);

    const isSwapping = useMemo(() => votes.length > 0 && !isVoted, [votes, isVoted]);

    const isVoting = useMemo(() => votes.length === 0 && !isVoted, [votes, isVoted]);

    const clickHandler = () => {
        console.log('Voting for delegate:', delegate?.address());
    };

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
            <Button variant='primary' disabled={disabled} onClick={clickHandler}>
                {voteText}
            </Button>
        </Footer>
    );
};
