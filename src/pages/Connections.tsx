import EmptyConnections from '@/components/connections/EmptyConnections';
import ConnectionsList from '@/components/connections/ConnectionsList';
import { useAppSelector } from '@/lib/store';
import * as SessionStore from '@/lib/store/session';
import SubPageLayout from '@/components/settings/SubPageLayout';

const Connections = () => {
    const sessions = useAppSelector(SessionStore.selectSessions);

    return (
        <SubPageLayout title='Connected Apps'>
            {Object.values(sessions).length === 0 ? (
                <EmptyConnections />
            ) : (
                <div>
                    <ConnectionsList />
                </div>
            )}
        </SubPageLayout>
    );
};

export default Connections;
