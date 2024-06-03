import { useTranslation } from 'react-i18next';
import EmptyConnections from '@/components/connections/EmptyConnections';
import ConnectionsList from '@/components/connections/ConnectionsList';
import { useAppSelector } from '@/lib/store';
import * as SessionStore from '@/lib/store/session';
import SubPageLayout from '@/components/settings/SubPageLayout';

const Connections = () => {
    const sessions = useAppSelector(SessionStore.selectSessions);
    const { t } = useTranslation();

    if (Object.values(sessions).length === 0) {
        return (
            <SubPageLayout title={t('PAGES.CONNECTIONS.CONNECTED_APPS')}>
                <EmptyConnections />
            </SubPageLayout>
        );
    }

    return <ConnectionsList />;
};

export default Connections;
