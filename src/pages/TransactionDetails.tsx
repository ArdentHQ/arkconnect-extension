import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';

const TransactionDetails = () => {
  const { t } = useTranslation();

    return <SubPageLayout title={t('PAGES.TRANSACTION_DETAILS.PAGE_TITLE')}>Content</SubPageLayout>;
};

export default TransactionDetails;