import { useCallback, useEffect, useMemo, useRef } from 'react';
import { BIP44 } from '@ardenthq/sdk-cryptography';
import { Contracts as ProfilesContracts } from '@ardenthq/sdk-profiles';
import { FormikProps } from 'formik';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Heading, Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import { useLedgerContext, useLedgerScanner } from '@/lib/Ledger';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useProfileContext } from '@/lib/context/Profile';
import { ImportWithLedger } from '@/pages/ImportWithLedger';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import useOnError from '@/lib/hooks';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { AddressBalance, TestnetIcon } from '@/components/wallet/address/Address.blocks';
import { handleSubmitKeyAction } from '@/lib/utils/handleKeyAction';
import { WalletNetwork } from '@/lib/store/wallet';

type Props = {
    goToNextStep: () => void;
    formik: FormikProps<ImportWithLedger>;
};

const ImportWallets = ({ goToNextStep, formik }: Props) => {
    const network = useActiveNetwork();
    const onError = useOnError();
    const retryFunctionReference = useRef<() => void>();
    const { profile } = useProfileContext();
    const ledgerScanner = useLedgerScanner(network.coin(), network.id());
    const { isBusy, importLedgerWallets } = useLedgerContext();
    const { t } = useTranslation();

    const {
        scan,
        selectedWallets,
        canRetry,
        isScanning,
        abortScanner,
        wallets,
        isScanningMore,
        toggleSelect,
        isSelected,
    } = ledgerScanner;

    const showLoader = (isScanning || (isBusy && wallets.length === 0)) && !isScanningMore;

    // eslint-disable-next-line arrow-body-style
    useEffect(() => {
        return () => {
            abortScanner();
        };
    }, [abortScanner]);

    const lastPath = useMemo(() => {
        const ledgerPaths = wallets.map(({ path }) => path);
        const profileWalletsPaths = profile
            .wallets()
            .values()
            .map((wallet) =>
                wallet.data().get<string>(ProfilesContracts.WalletData.DerivationPath),
            );

        return [...profileWalletsPaths, ...ledgerPaths]
            .filter(Boolean)
            .sort((a, b) =>
                BIP44.parse(a!).addressIndex > BIP44.parse(b!).addressIndex ? -1 : 1,
            )[0];
    }, [profile, wallets]);

    const setRetryFn = useCallback(
        (callback?: () => void) => {
            retryFunctionReference.current = callback;
        },
        [retryFunctionReference],
    );

    useEffect(() => {
        if (canRetry) {
            setRetryFn?.(() => scan(profile, lastPath));
        } else {
            setRetryFn?.(undefined);
        }
        return () => setRetryFn?.(undefined);
    }, [setRetryFn, scan, canRetry, profile, lastPath]);

    useEffect(() => {
        scan(profile, lastPath);
    }, []);

    const showImportedWalletsLength = () => {
        let lengthDescriptor: string = '';

        if (selectedWallets.length === 1) {
            lengthDescriptor = `${selectedWallets.length} ${t('COMMON.ADDRESS')}`;
        } else if (selectedWallets.length > 1) {
            lengthDescriptor = `${selectedWallets.length} ${t('COMMON.ADDRESSES')}`;
        }

        return lengthDescriptor;
    };

    const importWallets = async () => {
        const coin = profile.coins().set(network.coin(), network.id());
        const importedWallets = await importLedgerWallets(selectedWallets, coin, profile);
        formik.setFieldValue('importedWallets', importedWallets);
    };

    const submitImportedWallets = async () => {
        formik.setFieldValue('wallets', selectedWallets);
        try {
            await importWallets();
            goToNextStep();
        } catch (error) {
            onError(error);
        }
    };

    const isWalletImported = (address: string) => {
        return !!profile.wallets().findByAddressWithNetwork(address, network.id());
    };

    return (
        <div>
            <div className='flex flex-row gap-2 items-center mb-2 pl-6'>
                <Heading level={3}>
                    {t('PAGES.IMPORT_WITH_LEDGER.SELECT_ADDRESSES_TO_IMPORT')}
                </Heading>
                {network.name() === WalletNetwork.DEVNET ? <TestnetIcon/> : null}
            </div>
            <p className='typeset-body mb-6 px-6 text-theme-secondary-500 dark:text-theme-secondary-300'>
                {t('PAGES.IMPORT_WITH_LEDGER.MULTIPLE_ADDRESSES_CAN_BE_IMPORTED')}
            </p>
            <div className='custom-scroll h-65 max-h-65 overflow-y-scroll border-b border-t border-solid border-b-theme-secondary-200 border-t-theme-secondary-200 dark:border-b-theme-secondary-700 dark:border-t-theme-secondary-700'>
                <HandleLoadingState loading={showLoader}>
                    {wallets.map((wallet) => {
                        const isImported = isWalletImported(wallet.address);

                        return (
                            <div
                                className={cn(
                                    'flex cursor-pointer justify-between transition-all duration-500 ease-in-out hover:bg-theme-secondary-50',
                                    {
                                        'bg-theme-secondary-100 text-theme-secondary-500 dark:bg-light-black dark:text-theme-secondary-300':
                                            isImported,
                                        'text-light-black dark:text-white': !isImported,
                                        'dark:bg-subtle-black dark:hover:bg-theme-secondary-700':
                                            !isImported && !isSelected(wallet.path),
                                        'bg-theme-primary-50 hover:bg-theme-primary-50 dark:bg-theme-primary-650/15 dark:hover:bg-theme-primary-650/15':
                                            !isImported && isSelected(wallet.path),
                                    },
                                )}
                                key={wallet.address}
                                onClick={() => {
                                    if (isImported) return;
                                    toggleSelect(wallet.path);
                                }}
                                onKeyDown={(e) =>
                                    handleSubmitKeyAction(e, () => toggleSelect(wallet.path))
                                }
                            >
                                <Tooltip
                                    disabled={!isImported}
                                    content={t('PAGES.IMPORT_WITH_LEDGER.ADDRESS_ALREADY_IMPORTED')}
                                    placement='bottom'
                                >
                                    <div
                                        className={cn(
                                            'flex w-full items-center justify-between px-6 py-4',
                                            {
                                                'text-theme-secondary-500 dark:text-theme-secondary-300':
                                                    isImported,
                                                'text-light-black dark:text-white': !isImported,
                                            },
                                        )}
                                    >
                                        <div className='flex flex-col gap-1'>
                                            <p className='typeset-headline'>
                                                {trimAddress(wallet.address, 10)}
                                            </p>
                                            <span className='typeset-body'>
                                                <AddressBalance
                                                    balance={wallet.balance ?? 0}
                                                    currency={getNetworkCurrency(network)}
                                                    maxDigits={2}
                                                />
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <div className='h-5 w-5'>
                                                <Checkbox
                                                    id={`import-${wallet.address}`}
                                                    name={`import-${wallet.address}`}
                                                    disabled={isImported}
                                                    checked={isSelected(wallet.path) || isImported}
                                                    onChange={() => toggleSelect(wallet.path)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Tooltip>
                            </div>
                        );
                    })}
                </HandleLoadingState>
            </div>
            <div className='px-4 pt-4'>
                <Button
                    variant='primary'
                    disabled={!selectedWallets.length}
                    onClick={submitImportedWallets}
                >
                    {t('ACTION.IMPORT')} {showImportedWalletsLength()}
                </Button>
            </div>
        </div>
    );
};

export default ImportWallets;
