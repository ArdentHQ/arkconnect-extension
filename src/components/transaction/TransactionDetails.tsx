import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';

export const TransactionDetails = () => {
    const { t } = useTranslation();

    return <SubPageLayout title={t('PAGES.TRANSACTION_DETAILS.PAGE_TITLE')}>Content</SubPageLayout>;
};
