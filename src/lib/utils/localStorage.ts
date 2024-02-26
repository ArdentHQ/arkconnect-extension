import browser from 'webextension-polyfill';

const KEY = import.meta.env.VITE_PUBLIC_LOCAL_STORAGE_KEY as string;

export enum AutoLockTimer {
  FIFTEEN_MINUTES = 15,
  ONE_HOUR = 60,
  TWELVE_HOURS = 720,
  TWENTY_FOUR_HOURS = 1440,
}

interface LocalStorageValues {
  autoLockTimer: AutoLockTimer;
  devModeSeeded: boolean;
  hasOnboarded: boolean;
  ratesCache?: {
    lastFetch: number;
    rates: Record<string, number>;
  };
}

type LocalStorageKeys = keyof LocalStorageValues;

const parseLocalStorageValues = async (): Promise<LocalStorageValues> => {
  const res = await browser.storage.local.get(KEY);

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
    hasOnboarded: localValues?.hasOnboarded ?? false,
    ratesCache: localValues?.ratesCache ?? undefined,
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

  await browser.storage.local.set({ [KEY]: newValue });
};

export const clearLocalStorage = async () => {
  await browser.storage.local.remove(KEY);
};
