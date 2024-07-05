import { storage } from 'webextension-polyfill';

export const KEY = import.meta.env.VITE_PUBLIC_LOCAL_STORAGE_KEY as string;

export enum AutoLockTimer {
    FIFTEEN_MINUTES = 15,
    ONE_HOUR = 60,
    TWELVE_HOURS = 720,
    TWENTY_FOUR_HOURS = 1440,
}

interface LocalStorageValues {
    autoLockTimer: AutoLockTimer;
    devModeSeeded: boolean;
    ratesCache?: {
        lastFetch: number;
        rates: Record<string, number>;
    };
}

type LocalStorageKeys = keyof LocalStorageValues;

const parseLocalStorageValues = async (): Promise<LocalStorageValues> => {
    const res = await storage.local.get(KEY);

    if (res === null) {
        return {} as LocalStorageValues;
    }

    return res[KEY] as LocalStorageValues;
};

export const getLocalValues = async (): Promise<LocalStorageValues> => {
    const localValues = await parseLocalStorageValues();
    return {
        autoLockTimer: localValues?.autoLockTimer,
        devModeSeeded: localValues?.devModeSeeded ?? false,
        ratesCache: localValues?.ratesCache,
    };
};

export const setLocalValue = async (
    key: LocalStorageKeys,
    value: LocalStorageValues[typeof key],
) => {
    const localValues = await parseLocalStorageValues();

    const newValue = {
        ...localValues,
        [key]: value,
    };

    await storage.local.set({ [KEY]: newValue });
};

export const clearLocalStorage = async () => {
    await storage.local.remove(KEY);
};

export const softClearLocalStorage = async () => {
    const { autoLockTimer } = await parseLocalStorageValues();

    await storage.local.clear();
    await storage.local.set({ [KEY]: { autoLockTimer } });
};
