import { useTranslation } from 'react-i18next';
import { TransactionAddress } from '../transaction/Transaction.blocks';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { Icon } from '@/shared/components';

export const Recipient = () => {
    const primaryWallet = usePrimaryWallet();
    const address = primaryWallet?.address() ?? '';
    const { t } = useTranslation();
    const { copy } = useClipboard();

    return (
        <div className='flex flex-col gap-1.5'>
            <span className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-200'>
                {t('COMMON.RECIPIENT')}
            </span>
            <div className='flex w-full items-center justify-between rounded-lg border border-theme-secondary-200 bg-white px-3 py-4 dark:border-theme-secondary-600 dark:bg-theme-secondary-800 dark:text-theme-secondary-400 dark:shadow-secondary-dark'>
                <TransactionAddress address={address} displayParenthesis />
                <button
                    type='button'
                    className='block'
                    onClick={() => copy(address, trimAddress(address, 'short'))}
                >
                    <Icon
                        icon='copy'
                        className='h-5 w-5 text-theme-primary-700 dark:text-theme-primary-600'
                    />
                </button>
            </div>
        </div>
    );
};
