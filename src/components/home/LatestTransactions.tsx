import { useTranslation } from 'react-i18next';
import { ConfirmedTransactionData } from '@ardenthq/sdk/distribution/esm/confirmed-transaction.dto.contract';
import { useEffect } from 'react';
import { IReadWriteWallet } from '@ardenthq/sdk-profiles/distribution/esm/wallet.contract';
import { useQuery } from 'react-query';
import { NoTransactions, TransactionsList } from './LatestTransactions.blocks';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';

const fetchTransactions = async (primaryWallet?: IReadWriteWallet) => {
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

export const LatestTransactions = () => {
  const { t } = useTranslation();
  const primaryWallet = usePrimaryWallet();

  const { data: transactions = [], refetch } = useQuery<ConfirmedTransactionData[]>(
    ['transactions', primaryWallet?.address()],
    () => fetchTransactions(primaryWallet),
    { 
      enabled: !!primaryWallet, 
      staleTime: 0,
      initialData: [],
      refetchInterval: 3000 
    }
);

  useEffect(() => {
    if (primaryWallet) {
      refetch();
    }
  }, [primaryWallet, refetch]);

  return (
    <div className="w-full h-full bg-white rounded-t-2xl dark:bg-subtle-black mt-4">
      <div className="border-b border-b-theme-secondary-200 p-4 text-light-black dark:text-white dark:border-b-theme-secondary-600 leading-tight font-medium text-lg">
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