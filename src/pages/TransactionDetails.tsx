import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { TransactionBody } from '@/components/transaction/details/TransactionBody';

const TransactionDetails = () => {
    const { t } = useTranslation();

    return (
        <SubPageLayout title={t('PAGES.TRANSACTION_DETAILS.PAGE_TITLE')}>
            <TransactionBody/>
        </SubPageLayout>
    );
};

export default TransactionDetails;
