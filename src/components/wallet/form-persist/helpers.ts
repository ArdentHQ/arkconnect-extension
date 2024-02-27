import { setLocalValue, PersistScreen, deleteLocalValue } from '.';

export const LOCAL_STORAGE_KEY = 'persist:form';

export const persistScreenChanged = (payload: PersistScreen | null) => {
  setLocalValue('persistScreen', payload);
};

export const clearPersistScreenData = () => {
  deleteLocalValue('persistScreen');
};
