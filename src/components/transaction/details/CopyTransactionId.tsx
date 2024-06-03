import { useTranslation } from 'react-i18next';
import useClipboard from '@/lib/hooks/useClipboard';
import { Icon, Tooltip } from '@/shared/components';


export const CopyTransactionId = ({
    transactionId
}: {
    transactionId: string;
}) => {
    const { t } = useTranslation();
    const { copy } = useClipboard();

    return (
        <Tooltip content={t('COMMON.COPY_with_name', {name: 'TxID'})}>
            <button
                type='button'
                className='block p-2 rounded-full dark:hover:bg-theme-secondary-700 bg-transparent transition-smoothEase dark:text-white text-light-black hover:bg-theme-secondary-100'
                onClick={() => copy(transactionId, t('COMMON.TRANSACTION_ID'))}
            >
                <Icon
                    icon='copy'
                    className='h-4 w-4'
                />
            </button>
        </Tooltip>
    );
};
