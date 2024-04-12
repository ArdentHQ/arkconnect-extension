import { useTranslation } from 'react-i18next';
import { ConfirmedTransactionData } from '@ardenthq/sdk/distribution/esm/confirmed-transaction.dto.contract';
import { useEffect, useState } from 'react';
import { NoTransactions, TransactionsList } from './LatestTransactions.blocks';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';


export const LatestTransactions = () => {
  const { t } = useTranslation();
  const primaryWallet = usePrimaryWallet();

  const [transactions, setTransactions] = useState<ConfirmedTransactionData[]>([]);

  const fetchTransactions = async () => {
      try {
          const response = await primaryWallet?.client().transactions({ 
              limit: 10, 
              identifiers: [{ type: 'address', value: primaryWallet?.address() }] 
          });
          return response?.items() || [];
      } catch (error) {
          return [];
      }
  };

  useEffect(() => {
      const fetchAndSetData = async () => {
          const transactions = await fetchTransactions();
          setTransactions(transactions);
      };

      fetchAndSetData();
  }, []);

    return (
        <div className='mt-4 h-full w-full rounded-t-2xl bg-white dark:bg-subtle-black'>
            <div className='border-b border-b-theme-secondary-200 p-4 text-lg font-medium leading-tight text-light-black dark:border-b-theme-secondary-600 dark:text-white'>
                {t('PAGES.HOME.LATEST_TRANSACTIONS')}
            </div>

      <div className="w-full h-auto">
        {
          transactions.length > 0 ? <TransactionsList transactions={transactions} />:
          <NoTransactions />
        }
        
      </div>
    </div>
  );
};
