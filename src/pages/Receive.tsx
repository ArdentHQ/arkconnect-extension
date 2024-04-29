import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';

const Receive = () => {
    const { t } = useTranslation();

    return (
        <SubPageLayout title={t('COMMON.RECEIVE')}>
            Receive page
        </SubPageLayout>
    );
};

export default Receive;