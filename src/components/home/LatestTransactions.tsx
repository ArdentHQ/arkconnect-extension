import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import classNames from 'classnames';
import { TransactionsTabs, TransactionTab } from './TransactionsTabs';
import { NoTransactions, TransactionsList } from './LatestTransactions.blocks';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { Loader } from '@/shared/components';
import { ExtendedConfirmedTransactionData } from '@/lib/profiles/transaction.dto';
import { IReadWriteWallet } from '@/lib/profiles/wallet.contract';

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
    } catch {
        return { transactions: [], hasMorePages: false };
    }
};

const fetchTokens = async (primaryWallet?: IReadWriteWallet): Promise<TransactionResponse> => {
    try {
        const response = await primaryWallet?.tokenIndex().all({ limit: 10 });

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
    } = useQuery<TransactionResponse>(
        ['tokens', primaryWallet?.address()],
        () => fetchTokens(primaryWallet),
        {
            enabled: !!primaryWallet,
            staleTime: 0,
            refetchInterval: 60000,
        },
    );

    const tabs = useMemo(() => {
        if (tokenData && tokenData.transactions.length > 0) {
            // return ['TOKENS', 'TRANSACTIONS'];
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
        <div className={classNames(['flex h-full w-full flex-col'], { 'mt-4': !showTabs })}>
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

            <div
                className={classNames([
                    'h-full w-full flex-1 bg-white dark:bg-subtle-black',
                    { 'rounded-t-xl': !showTabs },
                ])}
            >
                {!showTabs && (
                    <div className='border-b border-b-theme-secondary-200 p-4 text-lg font-medium leading-tight text-light-black dark:border-b-theme-secondary-600 dark:text-white'>
                        {t('PAGES.HOME.LATEST_TRANSACTIONS')}
                    </div>
                )}

                {showTabs && activeTab === 'TOKENS' ? (
                    <div className='h-auto w-full'></div>
                ) : !isLoading && data ? (
                    <div className='h-auto w-full'>
                        {data.transactions.length > 0 ? (
                            <TransactionsList
                                transactions={data.transactions}
                                displayButton={data.hasMorePages}
                                maxHeight={classNames({
                                    'max-h-[237px]': showTabs,
                                    'max-h-[270px]': !showTabs,
                                })}
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
