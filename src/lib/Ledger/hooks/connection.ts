import { Coins } from '@ardenthq/sdk';
import { Contracts } from '@ardenthq/sdk-profiles';
import { Options } from 'p-retry';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { connectionReducer, defaultConnectionState } from './connection.state';
import { useLedgerImport } from './import';
import { useLedgerContext } from '@/lib/Ledger/Ledger';
import { persistLedgerConnection } from '@/lib/Ledger/utils/connection';
import { closeDevices, isLedgerTransportSupported, openTransport } from '@/lib/Ledger/transport';
import { useEnvironmentContext } from '@/lib/context/Environment';
import useSentryException from '@/lib/hooks/useSentryException';

type LedgerConnectionError = { statusText?: string; message: string };

export const useLedgerConnection = () => {
    const { env } = useEnvironmentContext();
    const [state, dispatch] = useReducer(connectionReducer, defaultConnectionState);
    const abortRetryReference = useRef<boolean>(false);
    const { device, isBusy, isConnected, isWaiting, error } = state;
    const { importLedgerWallets } = useLedgerImport({ device, env });

    // Actively listen to WebUSB devices and emit ONE device that was either accepted before,
    // if not it will trigger the native permission UI.
    // Important: it must be called in the context of a UI click.
    const listenDevice = useCallback(async () => {
        await resetConnectionState();

        dispatch({ type: 'waiting' });

        try {
            const { descriptor, deviceModel } = await openTransport();
            dispatch({ id: deviceModel?.id || 'nanoS', path: descriptor, type: 'add' });
        } catch (error: any) {
            dispatch({ message: error.message, type: 'failed' });
        }
    }, []);

    const handleLedgerConnectionError = useCallback(
        async (error: LedgerConnectionError, coin: Coins.Coin) => {
            try {
                await disconnect();
                await resetConnectionState();
                await coin.ledger().disconnect();
            } catch (error) {
                useSentryException(error);
            }

            if (error.message === 'COMPATIBILITY_ERROR') {
                return dispatch({
                    message:
                        'ARK Connect requires the use of a chromium based browser when using a Ledger device. Please use another browser like Chrome.',
                    type: 'failed',
                });
            }

            if (error.statusText === 'UNKNOWN_ERROR') {
                return dispatch({
                    message:
                        'Generic connection error, please reload website or check Ledger device',
                    type: 'failed',
                });
            }

            if (error.message === 'CONNECTION_ERROR') {
                return dispatch({
                    message:
                        'Generic connection error, please reload website or check Ledger device',
                    type: 'failed',
                });
            }

            if (error.message === 'VERSION_ERROR') {
                return dispatch({
                    message: 'Please update the coin app via Ledger Live.',
                    type: 'failed',
                });
            }

            dispatch({ message: error.message, type: 'failed' });
        },
        [dispatch],
    );

    const connect = useCallback(
        async (
            profile: Contracts.IProfile,
            coin: string,
            network: string,
            retryOptions?: Options,
        ) => {
            const coinInstance = profile.coins().set(coin, network);

            if (!isLedgerTransportSupported()) {
                handleLedgerConnectionError({ message: 'COMPATIBILITY_ERROR' }, coinInstance);
                return;
            }

            const options = retryOptions || { factor: 1, randomize: false, retries: 50 };

            dispatch({ type: 'waiting' });
            abortRetryReference.current = false;

            try {
                await persistLedgerConnection({
                    coin: coinInstance,
                    hasRequestedAbort: () => abortRetryReference.current,
                    options,
                });
                dispatch({ type: 'connected' });
            } catch (connectError: any) {
                handleLedgerConnectionError(connectError, coinInstance);
            }
        },
        [],
    );

    const setBusy = useCallback(() => dispatch({ type: 'busy' }), []);
    const setIdle = useCallback(() => dispatch({ type: 'connected' }), []);

    const abortConnectionRetry = useCallback(() => (abortRetryReference.current = true), []);
    const isAwaitingConnection = useMemo(() => isWaiting && !isConnected, [isConnected, isWaiting]);
    const isAwaitingDeviceConfirmation = useMemo(
        () => isWaiting && isConnected,
        [isConnected, isWaiting],
    );
    const hasDeviceAvailable = useMemo(() => !!device, [device]);

    const resetConnectionState = useCallback(async () => {
        await closeDevices();
        dispatch({ type: 'remove' });
    }, []);

    const disconnect = useCallback(async () => {
        await closeDevices();
        dispatch({ type: 'disconnected' });
    }, []);

    const removeErrors = useCallback(() => {
        dispatch({ type: 'removeErrors' });
    }, []);

    const accessDenied = useCallback(() => {
        dispatch({ type: 'accessDenied' });
    }, []);

    return {
        abortConnectionRetry,
        connect,
        disconnect,
        dispatch,
        error,
        hasDeviceAvailable,
        importLedgerWallets,
        isAwaitingConnection,
        isAwaitingDeviceConfirmation,
        isBusy,
        isConnected,
        ledgerDevice: device,
        listenDevice,
        resetConnectionState,
        setBusy,
        setIdle,
        handleLedgerConnectionError,
        removeErrors,
        accessDenied,
    };
};

export const useLedgerConnectionStatusMessage = (): string => {
    const { t } = useTranslation();

    const { hasDeviceAvailable, isConnected } = useLedgerContext();

    if (!hasDeviceAvailable) {
        return t('PAGES.IMPORT_WITH_LEDGER.STATUS.CLICK_CONNECT');
    }

    if (!isConnected) {
        return t('PAGES.IMPORT_WITH_LEDGER.STATUS.OPEN_ARK_APP');
    }

    return t('PAGES.IMPORT_WITH_LEDGER.STATUS.WAITING_FOR_YOUR_SIGNATURE');
};

export const useWaitForAvailableDevice = (): {
    waitUntilLedgerIsAvailable: () => Promise<void>;
} => {
    const { hasDeviceAvailable, listenDevice } = useLedgerContext();

    const [ledgerIsAvailableResolver, setDeviceIsAvailableResolver] = useState<() => void>();

    // Resolve the promise that waits for the device to be available once it is
    useEffect(() => {
        if (hasDeviceAvailable && ledgerIsAvailableResolver !== undefined) {
            ledgerIsAvailableResolver();

            setDeviceIsAvailableResolver(undefined);
        }
    }, [hasDeviceAvailable, ledgerIsAvailableResolver]);

    const waitUntilLedgerIsAvailable = async () => {
        return new Promise<void>((resolve) => {
            if (!hasDeviceAvailable) {
                listenDevice();

                setDeviceIsAvailableResolver(() => resolve);
            } else {
                resolve();
            }
        });
    };

    return {
        waitUntilLedgerIsAvailable,
    };
};

export const useWaitForConnectedDevice = (): {
    waitUntilLedgerIsConnected: () => Promise<void>;
} => {
    const { isConnected } = useLedgerContext();

    const [ledgerIsAvailableResolver, setDeviceIsAvailableResolver] = useState<() => void>();

    // Resolve the promise that waits for the device to be connected once it is
    useEffect(() => {
        if (isConnected && ledgerIsAvailableResolver !== undefined) {
            ledgerIsAvailableResolver();

            setDeviceIsAvailableResolver(undefined);
        }
    }, [isConnected, ledgerIsAvailableResolver]);

    const waitUntilLedgerIsConnected = async () => {
        return new Promise<void>((resolve) => {
            if (!isConnected) {
                setDeviceIsAvailableResolver(() => resolve);
            } else {
                resolve();
            }
        });
    };

    return {
        waitUntilLedgerIsConnected,
    };
};
