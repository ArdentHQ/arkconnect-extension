import { useTranslation } from 'react-i18next';
import { TransactionAddress } from '../transaction/Transaction.blocks';
import { CopyAddress } from '../wallet/CopyAddress';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';

export const Recipient = () => {
    const primaryWallet = usePrimaryWallet();
    const address = primaryWallet?.address() ?? '';
    const { t } = useTranslation();

    return (
        <div className='flex flex-col gap-1.5'>
            <span className='text-theme-secondary-500 dark:text-theme-secondary-200 text-sm font-medium'>
                {t('COMMON.RECIPIENT')}
            </span>
            <div className='border-theme-secondary-200 dark:border-theme-secondary-600 dark:bg-theme-secondary-800 dark:text-theme-secondary-400 dark:shadow-secondary-dark flex w-full items-center justify-between rounded-lg border bg-white py-2.5 pr-1.5 pl-3'>
                <TransactionAddress address={address} displayParenthesis />
                <CopyAddress />
            </div>
        </div>
    );
};
