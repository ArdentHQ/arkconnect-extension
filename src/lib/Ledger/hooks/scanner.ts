import { uniqBy, omitBy } from '@ardenthq/sdk-helpers';
import { Contracts as ProfilesContracts } from '@ardenthq/sdk-profiles';
import { Contracts } from '@ardenthq/sdk';
import { useCallback, useMemo, useReducer, useRef, useState } from 'react';
import { useLedgerContext } from '../Ledger';
import { LedgerData } from '../Ledger.contracts';
import { scannerReducer } from './scanner.state';

export const useLedgerScanner = (coin: string, network: string) => {
  const { setBusy, setIdle } = useLedgerContext();

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

  const scan = async (profile: ProfilesContracts.IProfile, startPath?: string) => {
    try {
      setIdle();
      dispatch({ type: 'waiting' });

      setIsScanning(true);

      const isLoadingMore = wallets.length > 0;
      if (isLoadingMore) {
        setIsScanningMore(true);
      }

      setBusy();
      abortRetryReference.current = false;

      const instance = profile.coins().set(coin, network);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const ledgerWallets = await instance.ledger().scan({ onProgress, startPath });

      const legacyWallets = isLoadingMore
        ? {}
        : await instance.ledger().scan({ onProgress, useLegacy: true });

      const allWallets = { ...legacyWallets, ...ledgerWallets };

      let ledgerData: LedgerData[] = [];

      for (const [path, data] of Object.entries(allWallets)) {
        const address = data.address();
        ledgerData.push({
          address,
          balance: data.balance().available.toHuman(),
          path,
        });
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
    } catch (error: any) {
      dispatch({ error: error.message, type: 'failed' });
    } finally {
      setIdle();
      setIsScanning(false);
      setIsScanningMore(false);
    }
  };

  const abortScanner = useCallback(() => {
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
