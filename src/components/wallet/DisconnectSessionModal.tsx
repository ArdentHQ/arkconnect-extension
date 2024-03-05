import { runtime } from 'webextension-polyfill';
import RemoveConnections from '../connections/RemoveConnections';
import Modal from '@/shared/components/modal/Modal';
import { useAppDispatch } from '@/lib/store';
import * as SessionStore from '@/lib/store/session';

interface Properties {
    onCancel?: () => void;
    onConfirm: () => void;
    session?: SessionStore.Session;
    isOpen?: boolean;
}
export const DisconnectSessionModal = ({ isOpen, onCancel, onConfirm, session }: Properties) => {
    const dispatch = useAppDispatch();

    const handleDisconnect = async () => {
        if (!session) {
            return;
        }

        await dispatch(SessionStore.sessionRemoved([session.id]));

        await runtime.sendMessage({
            type: 'DISCONNECT_RESOLVE',
            data: {
                domain: session.domain,
                status: 'success',
                disconnected: false,
            },
        });

        onConfirm?.();
    };

    if (!isOpen) {
        return <></>;
    }

    return (
        <Modal
            hideCloseButton
            onClose={() => onCancel?.()}
            onCancel={() => onCancel?.()}
            icon='alert-octagon'
            variant='danger'
            onResolve={handleDisconnect}
            focusTrapOptions={{
                initialFocus: false,
            }}
        >
            <RemoveConnections sessionDomain={session?.domain} />
        </Modal>
    );
};
