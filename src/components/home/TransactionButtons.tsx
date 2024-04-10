import { useTranslation } from 'react-i18next';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { Button, Tooltip } from '@/shared/components';

export const TransactionButtons = () => {
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();
    const walletBalance = primaryWallet?.balance() ?? 0;

    return (
        <div className='mx-4 grid grid-cols-2 items-center justify-center gap-2'>
            <Tooltip
                disabled={walletBalance > 0}
                content={<p>{t('PAGES.HOME.INSUFFICIENT_FUNDS')}</p>}
                placement='top'
            >
                <div>
                    <Button iconLeading='send' variant='secondary' disabled={walletBalance === 0}>
                        {t('COMMON.SEND')}
                    </Button>
                </div>
            </Tooltip>
            <Button iconLeading='receive' variant='secondary'>
                {t('COMMON.RECEIVE')}
            </Button>
        </div>
    );
};
