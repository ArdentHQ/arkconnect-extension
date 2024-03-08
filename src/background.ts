import { Runtime, runtime, tabs } from 'webextension-polyfill';
import { UUID } from '@ardenthq/sdk-cryptography';
import { AutoLockTimer, setLocalValue } from './lib/utils/localStorage';

import { Extension } from './lib/background/extension';
import keepServiceWorkerAlive from './lib/background/keepServiceWorkerAlive';
import { longLivedConnectionHandlers } from './lib/background/eventListenerHandlers';
import { OneTimeEventHandlers, OneTimeEvents } from '@/OneTimeEventHandlers';

const initialPassword = UUID.random();

const extension = Extension();
extension.boot(initialPassword);

const oneTimeEventHandlers = OneTimeEventHandlers(extension);

const initOneTimeEventListeners = () => {
    runtime.onMessage.addListener(async function (request) {
        const type = request.type as OneTimeEvents;

        let response;
        if (oneTimeEventHandlers[type]) {
            response = await oneTimeEventHandlers[type](request);
        }

        if (request?.data?.tabId && (type.endsWith('_RESOLVE') || type.endsWith('_REJECT'))) {
            void tabs.sendMessage(request.data.tabId, request);
        }

        return response;
    });
};

const handleLongLivedConnection = async (message: any, port: Runtime.Port) => {
    const type = message.type as keyof typeof longLivedConnectionHandlers;

    if (longLivedConnectionHandlers[type]) {
        void longLivedConnectionHandlers[type](
            {
                ...message,
                data: {
                    ...message.data,
                    tabId: port.sender?.tab?.id,
                    port: port,
                },
            },
            extension.profile(),
        );
    }
};

runtime.onInstalled.addListener(async () => {
    await setLocalValue('autoLockTimer', AutoLockTimer.TWENTY_FOUR_HOURS);
});

initOneTimeEventListeners();
keepServiceWorkerAlive();

runtime.onConnect.addListener((port) => {
    if (port.name === 'ark-content-script') {
        port.onMessage.addListener(handleLongLivedConnection);
    }
});
