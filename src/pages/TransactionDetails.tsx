import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { Loader } from '../shared/components/loader/Loader';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { TransactionHeader } from '@/components/transaction/details/TransactionHeader';
import { getType, TransactionType } from '@/components/home/LatestTransactions.blocks';

const TransactionDetails = () => {
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();
    const { transactionId } = useParams<{ transactionId: string }>();

    const [transactionData, setTransactionData] = useState<ExtendedConfirmedTransactionData>();
    
    const fetchTransactionData = async () => {
        try {
            const response = await primaryWallet?.transactionIndex().findById(transactionId ?? '');
            return response;
        } catch (error) {
            return [];
        }
    };


    useEffect(() => {
        const fetchAndSetData = async () => {
            const data = await fetchTransactionData();

            if (data && !Array.isArray(data)) {
                setTransactionData(data);
            }
        };

        fetchAndSetData();
    }, []);

    return (
        <SubPageLayout title={t('PAGES.TRANSACTION_DETAILS.PAGE_TITLE')}>
            {
                transactionData ? <TransactionHeader type={getType(transactionData) as TransactionType} /> : <Loader/>
            }
        </SubPageLayout>
    );
};

export default TransactionDetails;
