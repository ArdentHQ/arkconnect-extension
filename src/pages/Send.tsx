import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';

const Send = () => {
    const { t } = useTranslation();

    return (
        <SubPageLayout title={t('COMMON.SEND')}>
            Send page
        </SubPageLayout>
    );
};

export default Send;