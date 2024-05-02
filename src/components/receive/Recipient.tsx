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
            <span className='text-theme-secondary-500 text-sm font-medium dark:text-theme-secondary-200'>{t('COMMON.RECIPIENT')}</span>
            <div className='bg-white border rounded-lg border-theme-secondary-200 px-3 py-4 flex justify-between w-full items-center dark:shadow-secondary-dark dark:border-theme-secondary-600 dark:bg-theme-secondary-800 dark:text-theme-secondary-400'>
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
