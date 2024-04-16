import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { NoTransactions, TransactionsList } from './LatestTransactions.blocks';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';

export const LatestTransactions = () => {
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();

    const [transactions, setTransactions] = useState<ExtendedConfirmedTransactionData[]>([]);

    const fetchTransactions = async () => {
        try {
            const response = await primaryWallet?.transactionIndex().all({ limit: 10 });
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

            <div className='h-auto w-full'>
                {transactions.length > 0 ? (
                    <TransactionsList transactions={transactions} />
                ) : (
                    <NoTransactions />
                )}
            </div>
        </div>
    );
};
