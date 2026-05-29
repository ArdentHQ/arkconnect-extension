import { Runtime, runtime, tabs } from 'webextension-polyfill';
import { UUID } from '@ardenthq/arkvault-crypto';
import { AutoLockTimer, getLocalValues, setLocalValue } from './lib/utils/localStorage';
import { Extension } from './lib/background/extension';
import keepServiceWorkerAlive from './lib/background/keepServiceWorkerAlive';
import { longLivedConnectionHandlers } from './lib/background/eventListenerHandlers';
import { OneTimeEventHandlers, OneTimeEvents } from '@/OneTimeEventHandlers';
import { applySidepanelMode } from '@/lib/background/sidepanel';

// Registered as top-level side effects: MV3 service workers must attach their
// listeners synchronously on worker startup, and wxt's config loader skips
// side-effect-only entrypoint imports (so the heavy app graph isn't pulled
// into its DOM-less vite-node analysis). The wxt background entrypoint is a
// thin `import '@/background'` wrapper around this module.

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
            extension.isLocked(),
        );
    }
};

runtime.onInstalled.addListener(async (details) => {
    await setLocalValue('autoLockTimer', AutoLockTimer.TWENTY_FOUR_HOURS);

    if (details.reason === 'install') {
        await setLocalValue('openInSidepanel', false);
    }
});

// Restore sidepanel state after service worker restarts
void getLocalValues().then(({ openInSidepanel }) => applySidepanelMode(openInSidepanel ?? false));

initOneTimeEventListeners();
keepServiceWorkerAlive();

runtime.onConnect.addListener((port) => {
    if (port.name === 'ark-content-script') {
        port.onMessage.addListener(handleLongLivedConnection);
    }
});
