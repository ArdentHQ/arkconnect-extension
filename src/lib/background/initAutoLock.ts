import { runtime, windows } from 'webextension-polyfill';
import { LockHandler } from '@/lib/background/handleAutoLock';

const initAutoLock = (lockHandler: LockHandler) => {
    runtime.onStartup.addListener(async () => {
        const allWindows = await windows.getAll();
        if (allWindows.length === 1) {
            lockHandler.lock();
        }
    });
};

export default initAutoLock;
