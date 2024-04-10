import { useTranslation } from 'react-i18next';
import { EmptyConnectionsIcon } from '@/shared/components';

const NoTransactions = () => {
    const { t } = useTranslation();

    return (
        <div className='mt-12 flex flex-col items-center justify-center gap-6'>
            <EmptyConnectionsIcon />
            <div className='max-w-40 text-center text-base font-normal leading-tight dark:text-white'>
                {t('PAGES.HOME.NO_TRANSACTIONS')}
            </div>
        </div>
    );
};

export const LatestTransactions = () => {
    const { t } = useTranslation();

    return (
        <div className='mt-4 h-full w-full rounded-t-2xl bg-white dark:bg-subtle-black'>
            <div className='border-b border-b-theme-secondary-200 p-4 text-lg font-medium leading-tight text-light-black dark:border-b-theme-secondary-600 dark:text-white'>
                {t('PAGES.HOME.LATEST_TRANSACTIONS')}
            </div>

            <div className='h-auto w-full'>
                <NoTransactions />
            </div>
        </div>
    );
};
