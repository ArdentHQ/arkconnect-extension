import { useTranslation } from 'react-i18next';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useMemo } from 'react';
import { Button, Tooltip } from '@/shared/components';

export const VoteButton = ({
    delegateAddress,
    votes,
    onClick,
    disabled,
    displayTooltip,
}: {
    delegateAddress: string;
    votes: Contracts.VoteRegistryItem[];
    onClick: () => void,
    disabled: boolean;
    displayTooltip: boolean;
}) => {
    const isVoted = useMemo(() => {
        if (delegateAddress === '') {
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
        <Tooltip content={<span>{t('ERROR.BALANCE_TOO_LOW')}</span>} disabled={displayTooltip}  >
            <div>
                <Button variant='primary' onClick={onClick} disabled={disabled}>
                    {voteText}
                </Button>
            </div>
        </Tooltip>
    );
};
