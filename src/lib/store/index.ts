import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { uiReducer } from '@/lib/store/ui';
import walletReducer from '@/lib/store/wallet';
import modalReducer from '@/lib/store/modal';
import sessionReducer from '@/lib/store/session';

const rootReducer = combineReducers({
  ui: uiReducer,
  wallet: walletReducer,
  modal: modalReducer,
  session: sessionReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const persistor = persistStore(store);

export default store;
