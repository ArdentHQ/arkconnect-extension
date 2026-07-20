import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Loader } from '../shared/components/loader/Loader';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { TransactionBody } from '@/components/transaction/details/TransactionBody';
import { TransactionHeader } from '@/components/transaction/details/TransactionHeader';
import { Button, ExternalLink } from '@/shared/components';
import { Footer } from '@/shared/components/layout/Footer';
import { ConfirmedTransactionData } from '@/lib/mainsail/confirmed-transaction.dto';
import { IReadWriteWallet } from '@/lib/profiles/wallet.contract';

type TransactionDetailsResponse = ConfirmedTransactionData | undefined;

const fetchTransactionDetails = async (
    primaryWallet?: IReadWriteWallet,
    transactionId?: string,
): Promise<TransactionDetailsResponse> => {
    try {
        return await primaryWallet?.transactionIndex().findById(transactionId ?? '');
    } catch {
        throw new Error('Error fetching transaction details');
    }
};

const TransactionDetails = () => {
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();
    const { transactionId } = useParams<{ transactionId: string }>();

    const {
        data: transactionData,
        refetch,
        isLoading,
    } = useQuery<TransactionDetailsResponse>(
        ['transaction-details', transactionId],
        () => fetchTransactionDetails(primaryWallet, transactionId),
        {
            enabled: !!primaryWallet,
            staleTime: 0,
            refetchInterval: false,
        },
    );

    useEffect(() => {
        if (primaryWallet) {
            refetch();
        }
    }, [primaryWallet, refetch]);

    return (
        <SubPageLayout
            title={t('PAGES.TRANSACTION_DETAILS.PAGE_TITLE')}
            footer={
                transactionData && (
                    <Footer>
                        <ExternalLink
                            href={transactionData.explorerLink()}
                            className='group hover:no-underline'
                        >
                            <Button
                                variant='secondary'
                                className='group-focus-visible:shadow-focus dark:group-focus-visible:shadow-focus-dark'
                            >
                                {t('COMMON.VIEW_ON_ARKSCAN')}
                            </Button>
                        </ExternalLink>
                    </Footer>
                )
            }
        >
            {transactionData && !isLoading ? (
                <>
                    <TransactionHeader transaction={transactionData} className='mb-4' />
                    <TransactionBody transaction={transactionData} />
                </>
            ) : (
                <div className='flex h-full w-full items-center justify-center'>
                    <Loader variant='big' />
                </div>
            )}
        </SubPageLayout>
    );
};

export default TransactionDetails;
