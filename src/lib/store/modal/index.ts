import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { revertAll } from '../ui';
import { RootState } from '@/lib/store';
import InitiateListenLedger from '@/components/ledger/InitiateListenLedger';

export enum CTAType {
    INITIATE_LEDGER = 'initiate-ledger',
}

export const CTA_CONTENT = {
    [CTAType.INITIATE_LEDGER]: InitiateListenLedger,
};

export type LoadingModalType = {
    isOpen?: boolean;
    isLoading?: boolean;
    loadingMessage?: string;
    completedMessage?: string;
    completedDescription?: string;
    CTA?: CTAType;
};

type ModalState = {
    loadingModal: LoadingModalType;
};

const initialState: ModalState = {
    loadingModal: {
        isOpen: false,
        isLoading: false,
    },
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        loadingModalUpdated: (state, action: PayloadAction<LoadingModalType>) => {
            state.loadingModal = action.payload;
        },
    },
    extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

export const { loadingModalUpdated } = modalSlice.actions;

export const selectLoadingModal = (state: RootState) => state.modal.loadingModal;

export default modalSlice.reducer;
