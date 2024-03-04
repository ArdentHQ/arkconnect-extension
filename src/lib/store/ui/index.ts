import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastPosition } from '@/components/toast/ToastContainer';
import { RootState } from '@/lib/store';
import persist from '@/lib/store/persist';

export enum ThemeMode {
    LIGHT = 'light',
    DARK = 'dark',
}

export type ToastType = 'warning' | 'danger' | 'success';

export type Toast = {
    type: ToastType;
    message: string;
    toastPosition?: ToastPosition;
};

export type UIState = {
    themeMode: ThemeMode;
    toasts: Toast[];
    testnetEnabled: boolean;
    locked: boolean;
};

const initialState: UIState = {
    themeMode: ThemeMode.LIGHT,
    toasts: [],
    testnetEnabled: false,
    locked: false,
};

export const revertAll = createAction('REVERT_ALL');

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        themeModeUpdated: (state, action: PayloadAction<ThemeMode>) => {
            state.themeMode = action.payload;
        },
        toastAdded: (state, action: PayloadAction<Toast>) => {
            state.toasts.push(action.payload);
        },
        toastRemoved: (state, action: PayloadAction<Toast>) => {
            state.toasts = state.toasts.filter((toast) => toast.message !== action.payload.message);
        },
        toastsReseted: (state) => {
            state.toasts = [];
        },
        testnetEnabledChanged: (state, action: PayloadAction<boolean>) => {
            state.testnetEnabled = action.payload;
        },

        lockedChanged: (state, action: PayloadAction<boolean>) => {
            state.locked = action.payload;
        },
    },
    extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

export const {
    themeModeUpdated,
    toastAdded,
    toastRemoved,
    toastsReseted,
    testnetEnabledChanged,
    lockedChanged,
} = uiSlice.actions;

export const selectThemeMode = (state: RootState) => state.ui.themeMode;
export const selectToasts = (state: RootState) => state.ui.toasts;
export const selectTestnetEnabled = (state: RootState) => state.ui.testnetEnabled;
export const selectLocked = (state: RootState) => state.ui.locked;

export const uiReducer = persist('ui', uiSlice.reducer);
