import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { revertAll } from '../ui';
import { RootState } from '@/lib/store';

export enum WalletNetwork {
    DEVNET = 'Devnet',
    MAINNET = 'Mainnet',
}

export type Wallet = {
    walletId: string;
    passphrase?: string[];
};

export type WalletEntries = Wallet[];

type WalletState = {
    wallets: WalletEntries;
    primaryWalletId?: string;
};

const initialState: WalletState = {
    wallets: [],
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        walletAdded: (state, action: PayloadAction<Wallet>) => {
            if (!state.wallets.some((wallet) => wallet.walletId === action.payload.walletId)) {
                state.wallets.push(action.payload);
            }
        },

        walletRemoved: (state, action: PayloadAction<string | string[]>) => {
            if (Array.isArray(action.payload)) {
                action.payload.forEach((walletId) => {
                    const index = state.wallets.findIndex((wallet) => wallet.walletId === walletId);
                    if (index !== -1) {
                        state.wallets.splice(index, 1);
                    }
                });
            } else {
                state.wallets = state.wallets.filter(
                    (wallet) => wallet.walletId !== action.payload,
                );
            }
        },

        walletsLoaded: (state, action: PayloadAction<WalletEntries>) => {
            state.wallets = action.payload;
        },

        primaryWalletIdChanged: (state, action: PayloadAction<string | undefined>) => {
            state.primaryWalletId = action.payload;
        },
    },
    extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

export const walletAdded = createAsyncThunk(
    'wallet/addWallet',
    async (wallet: Wallet, { dispatch }) => {
        dispatch(walletSlice.actions.walletAdded(wallet));
    },
);

export const walletsLoaded = createAsyncThunk(
    'wallet/walletsLoaded',
    async (wallets: WalletEntries, { dispatch }) => {
        dispatch(walletSlice.actions.walletsLoaded(wallets));
    },
);

export const walletRemoved = createAsyncThunk(
    'wallet/walletRemoved',
    async (idOrIds: string | string[], { dispatch }) => {
        dispatch(walletSlice.actions.walletRemoved(idOrIds));
    },
);

export const primaryWalletIdChanged = createAsyncThunk(
    'wallet/primaryWalletIdChanged',
    async (walletId: string, { dispatch }) => {
        dispatch(walletSlice.actions.primaryWalletIdChanged(walletId));
    },
);

export const selectWallets = (state: RootState) => state.wallet.wallets;
export const selectWalletsIds = (state: RootState) =>
    state.wallet.wallets.map((wallet) => wallet.walletId);
export const selectPrimaryWalletId = (state: RootState) => state.wallet.primaryWalletId;
export const selectWalletsLength = (state: RootState) => state.wallet.wallets.length;

export default walletSlice.reducer;
