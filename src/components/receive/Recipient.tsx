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
            <span className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-200'>
                {t('COMMON.RECIPIENT')}
            </span>
            <div className='flex w-full items-center justify-between rounded-lg border border-theme-secondary-200 bg-white py-2.5 pl-3 pr-1.5 dark:border-theme-secondary-600 dark:bg-theme-secondary-800 dark:text-theme-secondary-400 dark:shadow-secondary-dark'>
                <TransactionAddress address={address} displayParenthesis />
                <CopyAddress />
            </div>
        </div>
    );
};
