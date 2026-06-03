import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import classNames from 'classnames';
import { Tabs, TransactionsTabs, TransactionTab } from './TransactionsTabs';
import { NoTransactions, TokensList, TransactionsList } from './LatestTransactions.blocks';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { Loader } from '@/shared/components';
import { ExtendedConfirmedTransactionData } from '@/lib/profiles/transaction.dto';
import { IReadWriteWallet } from '@/lib/profiles/wallet.contract';
import { WalletToken } from '@/lib/profiles/wallet-token';

type TransactionResponse = {
    transactions: ExtendedConfirmedTransactionData[];
    hasMorePages: boolean;
};

const TOKENS_LIMIT = 10;

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

const fetchTokens = async (primaryWallet?: IReadWriteWallet): Promise<WalletToken[]> => {
    if (!primaryWallet) return [];

    try {
        const collection = await primaryWallet.client().tokenAddresses({
            addresses: [primaryWallet.address()],
            minBalance: '0',
        });

        return collection.items().slice(0, TOKENS_LIMIT);
    } catch {
        return [];
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
    } = useQuery<WalletToken[]>(
        ['tokens', primaryWallet?.address()],
        () => fetchTokens(primaryWallet),
        {
            enabled: !!primaryWallet,
            staleTime: 0,
            refetchInterval: 60000,
        },
    );

    const tabs = useMemo(() => {
        if (tokenData && tokenData.length > 0) {
            return [Tabs.TOKENS, Tabs.TRANSACTIONS];
        }

        return [Tabs.TRANSACTIONS];
    }, [tokenData]);

    useEffect(() => {
        if (primaryWallet) {
            refetch();
            refetchTokens();
        }
    }, [primaryWallet, refetch, refetchTokens]);

    const showTabs = !isLoadingTokens && tabs.length > 1;

    return (
        <div
            className={classNames(['flex h-full min-h-0 w-full flex-1 flex-col'], {
                'mt-4': !showTabs,
            })}
        >
            {showTabs && (
                <TransactionsTabs currentTab={activeTab}>
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
                    'dark:bg-subtle-black flex h-full min-h-0 w-full flex-1 flex-col bg-white',
                    { 'rounded-t-xl': !showTabs },
                ])}
            >
                {!showTabs && (
                    <div className='border-b-theme-secondary-200 text-light-black dark:border-b-theme-secondary-600 border-b p-4 text-lg leading-tight font-medium dark:text-white'>
                        {t('PAGES.HOME.LATEST_TRANSACTIONS')}
                    </div>
                )}

                {showTabs && activeTab === Tabs.TOKENS ? (
                    <TokensList tokens={tokenData ?? []} />
                ) : !isLoading && data ? (
                    <div className='flex min-h-0 flex-1 flex-col'>
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
