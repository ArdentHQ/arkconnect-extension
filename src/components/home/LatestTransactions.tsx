import { useTranslation } from 'react-i18next';
import { EmptyConnectionsIcon } from '@/shared/components';

const NoTransactions = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-6">
      <EmptyConnectionsIcon />
      <div className='max-w-40 leading-tight text-base font-normal text-center dark:text-white'>
        {t('PAGES.HOME.NO_TRANSACTIONS')}
      </div>
    </div>
  );
};

export const LatestTransactions = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full bg-white rounded-t-2xl dark:bg-subtle-black mt-4">
      <div className="border-b border-b-theme-secondary-200 p-4 text-light-black dark:text-white dark:border-b-theme-secondary-600 leading-tight font-medium text-lg">
        {t('PAGES.HOME.LATEST_TRANSACTIONS')}
      </div>

      <div className="w-full h-auto">
        <NoTransactions />
      </div>
    </div>
  );
};