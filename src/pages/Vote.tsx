import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';

const Vote = () => {
    const { t } = useTranslation();

    return (
        <SubPageLayout title={t('PAGES.VOTE.VOTE')}>
            <></>
        </SubPageLayout>
    );
};

export default Vote;
