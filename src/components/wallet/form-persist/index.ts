import { CreateWalletFormik } from '../create';
import { ImportedWalletFormik } from '../import';
import { LOCAL_STORAGE_KEY } from './helpers';

type LocalStorageKeys = 'createWalletData' | 'importWalletData' | 'persistScreen';

export enum WalletFormScreen {
  ONBOARDING = '/onboarding',
  OVERVIEW = '/create-import-address',
  IMPORT = '/wallet/import',
}

interface LocalStorageValues {
  createWalletData: CreateWalletFormik;
  importWalletData: ImportedWalletFormik;
  persistScreen: PersistScreen | null;
}

export type PersistScreen = {
  screen: WalletFormScreen;
  step: number;
};

const parseLocalStorageValues = () => {
  const localItems = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (localItems === null) {
    return {};
  }

  return JSON.parse(localItems);
};

export const getPersistedValues = (): LocalStorageValues => {
  const localValues = parseLocalStorageValues();

  return {
    createWalletData: localValues?.createWalletData,
    importWalletData: localValues?.importWalletData,
    persistScreen: localValues?.persistScreen,
  };
};

export const setLocalValue = (key: LocalStorageKeys, value: LocalStorageValues[typeof key]) => {
  const localValues = parseLocalStorageValues();

  const newValue = {
    ...localValues,
    [key]: value,
  };

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue));
};

export const deleteLocalValue = (key: LocalStorageKeys) => {
  const localValues = parseLocalStorageValues();

  if (localValues[key]) {
    delete localValues[key];
  }

  if (localValues) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localValues));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};
