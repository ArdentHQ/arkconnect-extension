import { runtime } from 'webextension-polyfill';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ConnectData,
    EventPayload,
    SignMessageData,
    SignTransactionData,
    SignVoteData,
} from '../background/eventListenerHandlers';
import { useAppDispatch } from '../store';
import { lockedChanged } from '@/lib/store/ui';

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
    const navigate = useNavigate();

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
    }, []);

    const runEventHandlers = useCallback(() => {
        const eventsLength = events.length;

        if (eventsLength > 0) {
            events.forEach((event) => {
                event.callback(event.request);
            });

            setEvents([]);
        }

        return eventsLength;
    }, [events]);

    const onConnect = (request: EventPayload<ConnectData>) => {
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

    return runEventHandlers;
};

export default useBackgroundEventHandler;
