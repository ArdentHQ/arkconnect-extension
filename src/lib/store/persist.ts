import { AnyAction, Reducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

function persist<RootState>(key: string, reducer: Reducer<RootState, AnyAction>) {
    return persistReducer(
        {
            key,
            storage,
        },
        reducer,
    );
}

export default persist;
