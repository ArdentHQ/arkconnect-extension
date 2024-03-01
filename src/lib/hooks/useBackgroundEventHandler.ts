import { runtime } from 'webextension-polyfill';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ConnectData,
    EventPayload,
    SignMessageData,
    SignTransactionData,
    SignVoteData,
} from '../background/eventListenerHandlers';
import { useAppDispatch, useAppSelector } from '../store';
import { lockedChanged, selectLocked } from '@/lib/store/ui';
import { getPersistedValues } from '@/components/wallet/form-persist';

type Event = {
    callback: any;
    request: {
        type: string;
        data: any;
    };
};

const useBackgroundEventHandler = () => {
    const dispatch = useAppDispatch();
    const [events, setEvents] = useState<Event[]>([]);
    const locked = useAppSelector(selectLocked);
    const navigate = useNavigate();
    const { persistScreen } = getPersistedValues();

    useEffect(() => {
        // Listen for messages from background script
        runtime.onMessage.addListener(function (request) {
            switch (request.type) {
                case 'CONNECT_UI': {
                    setEvents([...events, { request, callback: onConnect }]);
                    break;
                }
                case 'DISCONNECT_UI': {
                    setEvents([...events, { request, callback: onDisconnect }]);
                    break;
                }
                case 'SIGN_MESSAGE_UI': {
                    setEvents([...events, { request, callback: onApproveRequest }]);
                    break;
                }
                case 'SIGN_TRANSACTION_UI': {
                    setEvents([...events, { request, callback: onApproveRequest }]);
                    break;
                }
                case 'SIGN_VOTE_UI': {
                    setEvents([...events, { request, callback: onApproveRequest }]);
                    break;
                }
                case 'LOCK_EXTENSION_UI': {
                    setEvents([...events, { request, callback: onLockExtension }]);
                    break;
                }
            }
        });
    }, [locked]);

    useEffect(() => {
        if (events.length === 0 || locked) return;

        events.forEach((event) => {
            event.callback(event.request);
        });
        setEvents([]);
    }, [events, locked]);

    const onConnect = (request: EventPayload<ConnectData>) => {
        // If persist screen is set, redirection is going to be handled on
        // `src/components/AutoUnlockWrapper.tsx@handlePersistScreenRedirect`
        // and navigates to the last used screen instead
        if (persistScreen) {
            return;
        }

        navigate('/connect', {
            state: request.data,
        });
    };

    const onDisconnect = (request: EventPayload<any>) => {
        navigate('/connections', {
            state: request.data,
        });
    };

    const onApproveRequest = (
        request: EventPayload<SignMessageData | SignTransactionData | SignVoteData>,
    ) => {
        navigate('/approve', {
            state: { ...request.data },
        });
    };

    const onLockExtension = () => {
        dispatch(lockedChanged(true));
    };
};

export default useBackgroundEventHandler;
