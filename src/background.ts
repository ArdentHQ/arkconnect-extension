import browser from 'webextension-polyfill';
import { UUID } from '@ardenthq/sdk-cryptography';
import { BACKGROUND_EVENT_LISTENERS_HANDLERS } from './lib/background/eventListenerHandlers';
import { AutoLockTimer, setLocalValue } from './lib/utils/localStorage';
import initAutoLock from './lib/background/initAutoLock';
import keepServiceWorkerAlive from './lib/background/keepServiceWorkerAlive';
import { createTestProfile, isDev } from './dev/utils/dev';
import { ProfileData } from './lib/background/contracts';
import { Extension } from './lib/background/extension';
import { RuntimeEventHandlers, RuntimeEventTypes } from '@/RuntimeEventHandler';

const initialPassword = UUID.random();

const extension = Extension();
extension.reset(initialPassword);

const runtimeEventHandlers = RuntimeEventHandlers(extension);

const initRuntimeEventListener = () => {
    browser.runtime.onMessage.addListener(async function (request) {
        const type = request.type as RuntimeEventTypes;

        if (runtimeEventHandlers[type]) {
            await runtimeEventHandlers[type](request);
        }

        if (request.data.tabId && (type.endsWith('_RESOLVE') || type.endsWith('_REJECT'))) {
            void browser.tabs.sendMessage(request.data.tabId, request);
        }
    });
};

const setupEventListeners = async (message: any, port: browser.Runtime.Port) => {
    const type = message.type as keyof typeof BACKGROUND_EVENT_LISTENERS_HANDLERS;

    if (!BACKGROUND_EVENT_LISTENERS_HANDLERS[type]) {
        return;
    }

    BACKGROUND_EVENT_LISTENERS_HANDLERS[type].callback(
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

browser.runtime.onInstalled.addListener(async () => {
    await setLocalValue('autoLockTimer', AutoLockTimer.TWENTY_FOUR_HOURS);
});

initAutoLock(extension.lockHandler());
initRuntimeEventListener();
keepServiceWorkerAlive();
setupProfileWithFixtures();

browser.runtime.onConnect.addListener((port) => {
    if (port.name === 'ark-content-script') {
        port.onMessage.addListener(setupEventListeners);
    }
});
