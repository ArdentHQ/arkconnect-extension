import { useTranslation } from 'react-i18next';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { useEffect } from 'react';
import { IReadWriteWallet } from '@ardenthq/sdk-profiles/distribution/esm/wallet.contract';
import { useQuery } from 'react-query';
import { NoTransactions, TransactionsList } from './LatestTransactions.blocks';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { Loader } from '@/shared/components';

type TransactionResponse = {
    transactions: ExtendedConfirmedTransactionData[];
    hasMorePages: boolean;
};

const fetchTransactions = async (
    primaryWallet?: IReadWriteWallet,
): Promise<TransactionResponse> => {
    try {
        const response = await primaryWallet?.transactionIndex().all({ limit: 10 });

        return {
            transactions: response?.items() || [],
            hasMorePages: response?.hasMorePages() || false,
        };
    } catch (error) {
        return { transactions: [], hasMorePages: false };
    }
};

export const LatestTransactions = () => {
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();

    const { data, refetch, isLoading } =
        useQuery<TransactionResponse>(
            ['transactions', primaryWallet?.address()],
            () => fetchTransactions(primaryWallet),
            {
                enabled: !!primaryWallet,
                staleTime: 0,
                refetchInterval: 3000,
            },
        );

    useEffect(() => {
        if (primaryWallet) {
            refetch();
        }
    }, [primaryWallet, refetch]);

    return (
        <div className='mt-4 h-full w-full rounded-t-2xl bg-white dark:bg-subtle-black'>
            <div className='border-b border-b-theme-secondary-200 p-4 text-lg font-medium leading-tight text-light-black dark:border-b-theme-secondary-600 dark:text-white'>
                {t('PAGES.HOME.LATEST_TRANSACTIONS')}
            </div>
            
            {
                !isLoading && data ? (
                    <div className='h-auto w-full'>
                        {data.transactions.length > 0 ? (
                            <TransactionsList
                                transactions={data.transactions}
                                displayButton={data.hasMorePages}
                            />
                        ) : (
                            <NoTransactions />
                        )}
                    </div>
                ) : (
                    <div className='h-[320px] w-full flex items-center justify-center'>
                        <Loader variant='big' className='dark:border-theme-secondary-700 dark:border-t-theme-primary-650' />
                    </div>
                )
            }

        </div>
    );
};
