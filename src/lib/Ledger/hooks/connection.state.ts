import { Handlers, OfUnion } from './reducer.contracts';
import { LedgerModel } from '@/lib/hooks/useLedgerModelStatus';

export interface LedgerDevice {
    path: string;
    id: LedgerModel;
}

interface LedgerConnectionState {
    device?: LedgerDevice;
    isConnected: boolean;
    isBusy: boolean;
    isWaiting: boolean;
    error?: any;
}

type Action =
    | { type: 'add'; path: string; id: string }
    | { type: 'remove' }
    | { type: 'connected' }
    | { type: 'busy' }
    | { type: 'waiting' }
    | { type: 'disconnected' }
    | { type: 'failed'; message: string }
    | { type: 'removeErrors' }
    | { type: 'accessDenied' };

export const defaultConnectionState = { isBusy: false, isConnected: false, isWaiting: false };

export const connectionReducer = (
    state: LedgerConnectionState,
    action: Action,
): LedgerConnectionState => {
    const handlers: Handlers<OfUnion<Action>, LedgerConnectionState> = {
        add: ({ id, path }) => ({
            ...state,
            device: {
                id: id as LedgerModel,
                path: path,
            },
        }),
        busy: () => ({
            ...state,
            isBusy: true,
            isWaiting: false,
        }),
        connected: () => ({
            ...state,
            isBusy: false,
            isConnected: true,
            isWaiting: false,
        }),
        disconnected: () => ({
            ...state,
            isBusy: false,
            isConnected: false,
            isWaiting: false,
        }),
        failed: ({ message }) => ({
            ...state,
            error: message,
            isBusy: false,
            isWaiting: false,
        }),
        remove: () => ({
            ...state,
            device: undefined,
            error: undefined,
            isConnected: false,
        }),
        waiting: () => ({
            ...state,
            error: undefined,
            isBusy: false,
            isWaiting: true,
        }),
        removeErrors: () => ({
            ...state,
            error: undefined,
        }),
        accessDenied: () => ({
            ...state,
            error: 'Access denied to use Ledger device',
        }),
    };

    return handlers[action.type](action as any);
};
