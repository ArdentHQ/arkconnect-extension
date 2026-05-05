import { useCallback, useMemo, useReducer, useRef, useState } from 'react';
import { scannerReducer } from './scanner.state';
import { Contracts } from '@/lib/mainsail';
import { useLedgerContext } from '@/lib/Ledger';
import { LedgerData } from '@/lib/Ledger/Ledger.contracts';
import { omitBy, uniqBy } from '@/lib/helpers';
import { Contracts as ProfilesContracts } from '@/lib/profiles';
import { persistLedgerConnection } from '@/lib/Ledger/utils/connection';

export const useLedgerScanner = (network: string) => {
    const { setBusy, setIdle, resetConnectionState, disconnect } = useLedgerContext();

    const [state, dispatch] = useReducer(scannerReducer, {
        selected: [],
        wallets: [],
    });

    const [loadedWallets, setLoadedWallets] = useState<Contracts.WalletData[]>([]);

    const { selected, wallets, error } = state;

    const isSelected = useCallback((path: string) => selected.includes(path), [selected]);

    const selectedWallets = useMemo(
        () => wallets.filter((item) => selected.includes(item.path)),
        [selected, wallets],
    );
    const canRetry = !!error;

    const [isScanning, setIsScanning] = useState(false);
    const [isScanningMore, setIsScanningMore] = useState(false);
    const abortRetryReference = useRef<boolean>(false);

    const onProgress = (wallet: Contracts.WalletData) => {
        setLoadedWallets(uniqBy([...loadedWallets, wallet], (wallet) => wallet.data.address));
    };

    const scanAddresses = async (profile: ProfilesContracts.IProfile, startPath?: string) => {
        const ledgerService = profile.ledger();

        setIdle();
        dispatch({ type: 'waiting' });

        setIsScanning(true);

        const isLoadingMore = wallets.length > 0;
        if (isLoadingMore) {
            setIsScanningMore(true);
        }

        setBusy();
        abortRetryReference.current = false;

        await persistLedgerConnection({
            hasRequestedAbort: () => abortRetryReference.current,
            ledgerService,
            options: { factor: 1, randomize: false, retries: 50 },
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const ledgerWallets = await ledgerService.scan({ onProgress, startPath });

        const legacyWallets = isLoadingMore
            ? {}
            : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              await ledgerService.scan({ onProgress, useLegacy: true });

        const allWallets = { ...legacyWallets, ...ledgerWallets };

        let ledgerData: LedgerData[] = [];

        for (const [path, data] of Object.entries(allWallets)) {
            const address = data.address();

            const wallet = await profile.walletFactory().fromAddress({ address });
            await wallet.synchroniser().identity();

            /* istanbul ignore next -- @preserve */
            if (!profile.wallets().findByAddressWithNetwork(address, network)) {
                ledgerData.push({
                    address,
                    balance: Number((wallet.balance() as any)?.toNumber?.() ?? wallet.balance() ?? 0),
                    path,
                });
            }
        }

        if (isLoadingMore) {
            ledgerData = omitBy(ledgerData, (wallet) =>
                wallets.some((w) => w.address === wallet.address),
            );
        } else {
            ledgerData = uniqBy([...wallets, ...ledgerData], (wallet) => wallet.address);
        }

        if (abortRetryReference.current) {
            return;
        }

        dispatch({ payload: ledgerData, type: 'success' });

        setIdle();
        setIsScanning(false);
        setIsScanningMore(false);
    };

    const scan = async (profile: ProfilesContracts.IProfile, startPath?: string) => {
        try {
            await scanAddresses(profile, startPath);
        } catch (error) {
            if (error?.message?.includes?.('busy')) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await scan(profile, startPath);
                return;
            }

            dispatch({ error: error.message, type: 'failed' });
        }
    };

    const abortScanner = useCallback(async () => {
        await disconnect();
        await resetConnectionState();

        abortRetryReference.current = true;
        setIdle();
    }, [setIdle]);

    const toggleSelect = useCallback(
        (path: string) => dispatch({ path, type: 'toggleSelect' }),
        [dispatch],
    );
    const toggleSelectAll = useCallback(() => dispatch({ type: 'toggleSelectAll' }), [dispatch]);

    return {
        abortScanner,
        canRetry,
        error,
        isScanning,
        isScanningMore,
        isSelected,
        loadedWallets,
        scan,
        selectedWallets,
        toggleSelect,
        toggleSelectAll,
        wallets,
    };
};
