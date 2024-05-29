import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { QRCodeContainer, Recipient } from '@/components/receive';

const Receive = () => {
    const { t } = useTranslation();

    return (
        <SubPageLayout title={t('COMMON.RECEIVE')}>
            <div className='flex flex-col gap-4'>
                <Recipient />
                <QRCodeContainer />
            </div>
        </SubPageLayout>
    );
};

export default Receive;
