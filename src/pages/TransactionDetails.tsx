import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { IReadWriteWallet } from '@ardenthq/sdk-profiles/distribution/esm/wallet.contract';
import { useQuery } from 'react-query';
import { Loader } from '../shared/components/loader/Loader';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { TransactionBody } from '@/components/transaction/details/TransactionBody';
import { TransactionHeader } from '@/components/transaction/details/TransactionHeader';

type TransactionDetailsResponse = ExtendedConfirmedTransactionData | undefined;

const fetchTransactionDetails = async (
    primaryWallet?: IReadWriteWallet,
    transactionId?: string,
): Promise<TransactionDetailsResponse> => {
    try {
        const transaction = await primaryWallet?.transactionIndex().findById(transactionId ?? '');
        if (transaction) {
            transaction.setMeta('address', primaryWallet?.address());
            transaction.setMeta('publicKey', primaryWallet?.publicKey());
        }
        return transaction;
    } catch (error) {
        return undefined;
    }
};

const TransactionDetails = () => {
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();
    const { transactionId } = useParams<{ transactionId: string }>();

    const { data: transactionData, refetch } = useQuery<TransactionDetailsResponse>(
        ['transaction-details', transactionId],
        () => fetchTransactionDetails(primaryWallet, transactionId),
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
        <SubPageLayout title={t('PAGES.TRANSACTION_DETAILS.PAGE_TITLE')}>
            {transactionData ? (
                <>
                    <TransactionHeader transaction={transactionData} className="mb-4" />
                    <TransactionBody transaction={transactionData} />
                </>
            ) : (
                <Loader />
            )}
        </SubPageLayout>
    );
};

export default TransactionDetails;
