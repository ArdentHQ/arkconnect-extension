import { windows } from 'webextension-polyfill';

const removeWindowInstance = async (id?: number, delay?: number) => {
    if (!id) return;
    if (delay) {
        const timeout = setTimeout(async () => {
            await windows.remove(id);
            clearTimeout(timeout);
        }, delay);
        return;
    }
    await windows.remove(id);
};

export default removeWindowInstance;
