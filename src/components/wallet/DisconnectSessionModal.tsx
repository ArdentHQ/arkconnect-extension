import { runtime } from 'webextension-polyfill';
import RemoveConnections from '@/components/connections/RemoveConnections';
import Modal from '@/shared/components/modal/Modal';
import { useAppDispatch } from '@/lib/store';
import * as SessionStore from '@/lib/store/session';
import { useProfileContext } from '@/lib/context/Profile';

interface Properties {
    onCancel?: () => void;
    onConfirm: () => void;
    sessions: SessionStore.Session[];
    isOpen?: boolean;
}
export const DisconnectSessionModal = ({ isOpen, onCancel, onConfirm, sessions }: Properties) => {
    const dispatch = useAppDispatch();
    const { profile } = useProfileContext();

    const handleDisconnect = async () => {
        await dispatch(SessionStore.sessionRemoved(sessions.map((session) => session.id)));

        for (const session of sessions) {
            await runtime.sendMessage({
                type: 'DISCONNECT_RESOLVE',
                data: {
                    domain: session.domain,
                    status: 'success',
                    disconnected: false,
                },
            });

            const profileSessions = profile
                .settings()
                .get('SESSIONS') as SessionStore.SessionEntries;
            const updatedSessions = Object.keys(profileSessions)
                .filter((id) => !sessions.map((session) => session.id).includes(id))
                .reduce<Record<string, SessionStore.Session>>((obj, key) => {
                    obj[key] = profileSessions[key];
                    return obj;
                }, {});
            profile.settings().set('SESSIONS', updatedSessions);
        }

        onConfirm?.();
    };

    if (!isOpen) {
        return <></>;
    }

    return (
        <Modal
            onClose={() => onCancel?.()}
            onCancel={onCancel}
            icon='alert-octagon'
            variant='danger'
            onResolve={handleDisconnect}
            hideCloseButton
            focusTrapOptions={{
                initialFocus: false,
            }}
        >
            <RemoveConnections
                sessionDomain={sessions.at(0)?.domain}
                numberOfSessions={sessions.length}
            />
        </Modal>
    );
};
