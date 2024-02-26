import { CreateWalletFormik } from '../create';
import { getPersistedValues, setLocalValue, PersistScreen, deleteLocalValue } from '.';
import { ImportedWalletFormik } from '../import';

export const LOCAL_STORAGE_KEY = 'persist:form';

export const initialCreateWalletData = {
  passphrase: [],
  confirmPassphrase: ['', '', ''],
  confirmationNumbers: [],
  passphraseValidationStatus: Array(3).fill('primary'),
  lostPasswordAwareness: false,
  termsAndConditionsConfirmed: false,
} as CreateWalletFormik;

export const initialImportWalletData = {
  passphraseValidation: 'primary',
  addressName: '',
  termsAndConditionsConfirmed: false,
} as ImportedWalletFormik;

export const createWalletChanged = (payload: Partial<CreateWalletFormik>) => {
  const { createWalletData } = getPersistedValues();

  const newValue = {
    ...createWalletData,
    ...payload,
  };

  setLocalValue('createWalletData', newValue);
};

export const importWalletChanged = (payload: Partial<ImportedWalletFormik>) => {
  const { importWalletData } = getPersistedValues();

  const newValue = {
    ...importWalletData,
    ...payload,
  };

  setLocalValue('importWalletData', newValue);
};

export const persistScreenChanged = (payload: PersistScreen | null) => {
  setLocalValue('persistScreen', payload);
};

export const clearPersistScreenData = () => {
  deleteLocalValue('persistScreen');
};

export const clearCreateWalletData = () => {
  deleteLocalValue('createWalletData');
};

export const clearImportWalletData = () => {
  deleteLocalValue('importWalletData');
};
