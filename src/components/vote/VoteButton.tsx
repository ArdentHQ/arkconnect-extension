import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components';
import { Footer } from '@/shared/components/layout/Footer';

export const VoteButton = ({
    disabled,
    onClick,
    type = 'vote',
}: {
    disabled: boolean;
    onClick: () => void;
    type?: 'vote' | 'unvote' | 'swap_vote';
}) => {
    const { t } = useTranslation();

    const voteText =
        type === 'vote'
            ? t('COMMON.VOTE')
            : type === 'unvote'
              ? t('COMMON.UNVOTE')
              : t('COMMON.SWAP_VOTE');

    return (
        <Footer className='h-[84px]'>
            <Button variant='primary' disabled={disabled} onClick={onClick}>
                {voteText}
            </Button>
        </Footer>
    );
};
