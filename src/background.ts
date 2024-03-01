import { runtime, Runtime } from 'webextension-polyfill';
import { UUID } from '@ardenthq/sdk-cryptography';
import { longLivedConnectionHandlers } from './lib/background/eventListenerHandlers';
import { AutoLockTimer, setLocalValue } from './lib/utils/localStorage';
import initAutoLock from './lib/background/initAutoLock';
import keepServiceWorkerAlive from './lib/background/keepServiceWorkerAlive';
import { createTestProfile, isDev } from './dev/utils/dev';
import { ProfileData } from './lib/background/contracts';
import { Extension } from './lib/background/extension';
import { OneTimeEventHandlers, OneTimeEvents } from '@/OneTimeEventHandlers';

const initialPassword = UUID.random();

const extension = Extension();
extension.reset(initialPassword);

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

const setupProfileWithFixtures = async () => {
    if (isDev()) {
        await createTestProfile({ env: extension.env() });
        extension
            .profile()
            .data()
            .set(ProfileData.PrimaryWalletId, extension.profile().wallets().first().id());

        await extension.persist();
    }
};

runtime.onInstalled.addListener(async () => {
    await setLocalValue('autoLockTimer', AutoLockTimer.TWENTY_FOUR_HOURS);
});

initAutoLock(extension.lockHandler());
initOneTimeEventListeners();
keepServiceWorkerAlive();
setupProfileWithFixtures();

runtime.onConnect.addListener((port) => {
    if (port.name === 'ark-content-script') {
        port.onMessage.addListener(handleLongLivedConnection);
    }
});
