import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { Loader } from '@/shared/components';
import { ExtendedConfirmedTransactionData } from '@/lib/profiles/transaction.dto';
import { IReadWriteWallet } from '@/lib/profiles/wallet.contract';
import classNames from 'classnames';
import { NoTransactions, TransactionsList } from './LatestTransactions.blocks';
import { TransactionsTabs, TransactionTab } from './TransactionsTabs';

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

// TODO: Implement fetching tokens when token index is implemented
const fetchTokens = async (): Promise<TransactionResponse> => {
    return {
        transactions: [],
        hasMorePages: false,
    };
};

export const LatestTransactions = () => {
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();
    const [activeTab, setActiveTab] = useState<string>('TOKENS');

    const { data, refetch, isLoading } = useQuery<TransactionResponse>(
        ['transactions', primaryWallet?.address()],
        () => fetchTransactions(primaryWallet),
        {
            enabled: !!primaryWallet,
            staleTime: 0,
            refetchInterval: 60000,
        },
    );

    const {
        data: tokenData,
        refetch: refetchTokens,
        isLoading: isLoadingTokens,
    } = useQuery<TransactionResponse>(['tokens', primaryWallet?.address()], () => fetchTokens(), {
        enabled: !!primaryWallet,
        staleTime: 0,
        refetchInterval: 60000,
    });

    const tabs = useMemo(() => {
        if (tokenData && tokenData.transactions.length > 0) {
            return ['TOKENS', 'TRANSACTIONS'];
        }

        return ['TRANSACTIONS'];
    }, [tokenData]);

    useEffect(() => {
        if (primaryWallet) {
            refetch();
            refetchTokens();
        }
    }, [primaryWallet, refetch, refetchTokens]);

    const showTabs = !isLoadingTokens && tabs.length > 1;

    return (
        <div className={classNames(['h-full w-full'], { 'mt-4': !showTabs })}>
            {showTabs && (
                <TransactionsTabs>
                    {tabs.map((tab) => (
                        <TransactionTab
                            key={tab}
                            active={activeTab === tab}
                            onClick={() => setActiveTab(tab)}
                        >
                            {t(`PAGES.HOME.TABS.${tab}`)}
                        </TransactionTab>
                    ))}
                </TransactionsTabs>
            )}

            <div className='h-full w-full rounded-t-xl bg-white dark:bg-subtle-black'>
                {!showTabs && (
                    <div className='border-b border-b-theme-secondary-200 p-4 text-lg font-medium leading-tight text-light-black dark:border-b-theme-secondary-600 dark:text-white'>
                        {t('PAGES.HOME.LATEST_TRANSACTIONS')}
                    </div>
                )}

                {!isLoading && data ? (
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
                    <div className='flex h-[270px] w-full items-center justify-center'>
                        <Loader
                            variant='big'
                            className='dark:border-theme-secondary-700 dark:border-t-theme-primary-650'
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
