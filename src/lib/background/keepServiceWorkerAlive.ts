import { runtime } from 'webextension-polyfill';

const keepServiceWorkerAlive = () => {
    const keepAliveInterval = setInterval(runtime.getPlatformInfo, 20e3);
    const keepAlive = () => keepAliveInterval;

    runtime.onStartup.addListener(() => {
        keepAlive();
    });

    runtime.onSuspend.addListener(() => {
        clearInterval(keepAliveInterval);
    });

    keepAlive();
};

export default keepServiceWorkerAlive;
