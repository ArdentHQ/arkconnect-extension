import { runtime } from 'webextension-polyfill';
import RemoveConnections from '@/components/connections/RemoveConnections';
import Modal from '@/shared/components/modal/Modal';
import { useAppDispatch } from '@/lib/store';
import * as SessionStore from '@/lib/store/session';
import { useProfileContext } from '@/lib/context/Profile';
import { ProfileData } from '@/lib/background/contracts';
import { useEnvironmentContext } from '@/lib/context/Environment';

interface Properties {
    onCancel?: () => void;
    onConfirm: () => void;
    sessions: SessionStore.Session[];
    isOpen?: boolean;
}
export const DisconnectSessionModal = ({ isOpen, onCancel, onConfirm, sessions }: Properties) => {
    const dispatch = useAppDispatch();
    const { profile } = useProfileContext();
    const { persist } = useEnvironmentContext();

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
                .get(ProfileData.Sessions);
            if (profileSessions) {
                const updatedSessions = Object.keys(profileSessions).filter(
                    (id) => !sessions.map((session) => session.id).includes(id),
                );
                profile.settings().set(ProfileData.Sessions, updatedSessions);
                await persist();
            }
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
