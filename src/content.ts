import browser from 'webextension-polyfill';
import { longLivedConnectionHandlers } from './lib/background/eventListenerHandlers';
import { ExtensionEvents } from './lib/events';

const port = browser.runtime.connect({ name: 'ark-content-script' });

const injectScript = (filename: string) => {
    try {
        const container = document.head || document.documentElement;
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('async', 'false');
        scriptTag.src = browser.runtime.getURL(filename);
        container.insertBefore(scriptTag, container.children[0]);
        container.removeChild(scriptTag);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('ArkConnect: Provider injection failed.', error);
    }
};

const setupEventListeners = () => {
    window.addEventListener(
        'message',
        (event) => {
            // We only accept messages from ourselves
            if (event.source !== window || !event.data.type) {
                return;
            }

            const type = event.data.type as keyof typeof longLivedConnectionHandlers;

            if (type?.endsWith('_RESOLVE') || type?.endsWith('_REJECT')) {
                return;
            }

            if (!longLivedConnectionHandlers[type]) {
                return;
            }

            port.postMessage(event.data);
        },
        false,
    );
};

// Send back the response event to inpage script
browser.runtime.onMessage.addListener(function (request) {
    if (ExtensionEvents().isSupported(request.type)) {
        window.postMessage(request, '*');
        return;
    }

    if (!request.type?.endsWith('_RESOLVE') && !request.type?.endsWith('_REJECT')) {
        return;
    }

    window.postMessage(request, '*');
});

const init = () => {
    injectScript('src/inpage.js');
    setupEventListeners();
};

init();
