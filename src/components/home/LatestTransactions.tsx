import { EmptyConnectionsIcon } from '@/shared/components';

const NoTransactions = () => {
  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-6">
      <EmptyConnectionsIcon />
      <div className='max-w-40 leading-tight text-base font-normal text-center dark:text-white'>
        You don’t have any transactions
      </div>
    </div>
  );
};

export const LatestTransactions = () => {
  return (
    <div className="w-full h-full bg-white rounded-t-2xl dark:bg-subtle-black mt-4">
      <div className="border-b border-b-theme-secondary-200 p-4 text-light-black dark:text-white dark:border-b-theme-secondary-600 leading-tight font-medium text-lg">
        Latest Transactions
      </div>

      <div className="w-full h-auto">
        <NoTransactions />
      </div>
    </div>
  );
};