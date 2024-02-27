import browser from 'webextension-polyfill';
import { LockHandler } from '@/lib/background/handleAutoLock';

const initAutoLock = (lockHandler: LockHandler) => {
    browser.runtime.onStartup.addListener(async () => {
        const windows = await browser.windows.getAll();
        if (windows.length === 1) {
            lockHandler.lock();
        }
    });
};

export default initAutoLock;
