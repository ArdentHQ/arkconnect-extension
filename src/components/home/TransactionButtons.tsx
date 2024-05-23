import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from '@/shared/components';

import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';

export const TransactionButtons = () => {
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();
    const navigate = useNavigate();
    const walletBalance = primaryWallet?.balance() ?? 0;

    return (
        <div className='mx-4 grid grid-cols-2 items-center justify-center gap-2'>
            <Tooltip
                disabled={walletBalance > 0}
                content={<p>{t('PAGES.HOME.INSUFFICIENT_FUNDS')}</p>}
                placement='top'
            >
                <div>
                    <Button
                        iconLeading='send'
                        iconClass='h-6 w-6'
                        variant='secondary'
                        disabled={walletBalance === 0}
                        onClick={() => navigate('/transaction/send')}
                    >
                        {t('COMMON.SEND')}
                    </Button>
                </div>
            </Tooltip>
            <Button
                iconLeading='receive'
                iconClass='h-6 w-6'
                variant='secondary'
                onClick={() => navigate('/transaction/receive')}
            >
                {t('COMMON.RECEIVE')}
            </Button>
        </div>
    );
};
