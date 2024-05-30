import { runtime } from 'webextension-polyfill';
import RemoveConnections from '@/components/connections/RemoveConnections';
import Modal from '@/shared/components/modal/Modal';
import { useAppDispatch } from '@/lib/store';
import * as SessionStore from '@/lib/store/session';

interface Properties {
    onCancel?: () => void;
    onConfirm: () => void;
    sessions: SessionStore.Session[];
    isOpen?: boolean;
}
export const DisconnectSessionModal = ({ isOpen, onCancel, onConfirm, sessions }: Properties) => {
    const dispatch = useAppDispatch();

    const handleDisconnect = async () => {
        await dispatch(SessionStore.sessionRemoved(sessions.map((session) => session.id)));

        // Might remove this after checking what's going on with the profile
        const sessionsIds = sessions.map((session) => session.id);

        await runtime.sendMessage({
            type: 'REMOVE_SESSIONS',
            data: { sessionsIds },
        });

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
