import { useEffect, useState } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import { FormikProps } from 'formik';
import { runtime } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import { ImportedWalletFormik } from '.';
import { TestnetIcon } from '@/components/wallet/address/Address.blocks';
import {
    Button,
    Heading,
    HeadingDescription,
    PassphraseInput,
    ToggleSwitch,
} from '@/shared/components';

import { assertWallet } from '@/lib/utils/assertions';
import { getDefaultAlias } from '@/lib/utils/getDefaultAlias';
import { selectWalletsIds } from '@/lib/store/wallet';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useAppSelector } from '@/lib/store';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useProfileContext } from '@/lib/context/Profile';
import useWalletImport from '@/lib/hooks/useWalletImport';
import useWalletSync from '@/lib/hooks/useWalletSync';
import { ScreenName } from '@/lib/background/contracts';

type Props = {
    goToNextStep: () => void;
    formik: FormikProps<ImportedWalletFormik>;
};

const EnterPassphrase = ({ goToNextStep, formik }: Props) => {
    const { values, setFieldValue } = formik;
    const [showPassphrase, setShowPassphrase] = useState<boolean>(false);
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const walletsIds = useAppSelector(selectWalletsIds);
    const activeNetwork = useActiveNetwork();
    const { profile, initProfile } = useProfileContext();
    const { onError } = useErrorHandlerContext();
    const { env } = useEnvironmentContext();
    const { syncAll } = useWalletSync({ env, profile });
    const { importWallet } = useWalletImport({ profile });
    const [submitAfterValidation, setSubmitAfterValidation] = useState<boolean>(false);
    const selectedNetwork = useActiveNetwork();
    const { t } = useTranslation();

    useEffect(() => {
        setSubmitAfterValidation(false);

        void validatePassphrase();
    }, [values.enteredPassphrase]);

    useEffect(() => {
        void runtime.sendMessage({
            type: 'SET_LAST_SCREEN',
            path: ScreenName.ImportWallet,
            data: {
                step: 0,
                network: activeNetwork.id(),
            },
        });
    }, []);

    useEffect(() => {
        if (values.passphraseValidation === 'errorFree' && submitAfterValidation) {
            setSubmitAfterValidation(false);

            void handleWalletImport();
        }
    }, [submitAfterValidation, values.passphraseValidation]);

    const validatePassphrase = async () => {
        if (!values.enteredPassphrase) {
            return setFieldValue('passphraseValidation', 'primary');
        }

        setIsValidating(true);

        let isValid: boolean;

        const passphraseLength = values.enteredPassphrase.split(' ').length;

        if (passphraseLength === 12 || passphraseLength === 24) {
            try {
                await profile.walletFactory().fromMnemonicWithBIP39({
                    coin: activeNetwork.coin(),
                    network: activeNetwork.id(),
                    mnemonic: values.enteredPassphrase,
                });

                isValid = true;
            } catch {
                isValid = false;
            }
        } else {
            isValid = false;
        }

        setFieldValue('passphraseValidation', isValid ? 'errorFree' : 'destructive');

        setIsValidating(false);
    };

    const checkIfWalletWasImported = () => {
        const profileWallets = profile.wallets().all();

        if (walletsIds.length === 0) {
            const lastWallet = profile.wallets().last();
            if (lastWallet) {
                profile.wallets().forget(lastWallet.id());
            }
        } else {
            Object.values(profileWallets).forEach((wallet) => {
                if (walletsIds.includes(wallet.id())) return;

                profile.wallets().forget(wallet.id());
            });
        }
    };

    const handleEnterKey = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        event.preventDefault();

        setSubmitAfterValidation(true);
    };

    const handleWalletImport = async (): Promise<void> => {
        try {
            checkIfWalletWasImported();
            setIsImporting(true);

            /*
             * Check if wallet is not imported yet,
             * or has been removed on LocalStorage
             * due to the unsupported format
             */
            if (!formik.values.wallet) {
                const importedWalletAlias = getDefaultAlias({
                    profile,
                    network: activeNetwork,
                });

                const isNewProfile = profile.wallets().count() === 0;

                const wallet = await importWallet({
                    network: activeNetwork,
                    value: formik.values.enteredPassphrase,
                });

                assertWallet(wallet);

                if (!isNewProfile) {
                    await runtime.sendMessage({
                        type: 'IMPORT_WALLETS',
                        data: {
                            wallets: [
                                {
                                    address: wallet.address(),
                                    network: wallet.network().id(),
                                    coin: wallet.network().coin(),
                                    alias: importedWalletAlias,
                                    mnemonic: formik.values.enteredPassphrase,
                                },
                            ],
                        },
                    });

                    void runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });

                    await initProfile();
                }

                await syncAll(wallet);

                wallet.mutator().alias(importedWalletAlias);
                wallet
                    .settings()
                    .set(Contracts.WalletSetting.Avatar, Math.round(Math.random() * 10000000));

                formik.setFieldValue('wallet', wallet);
                formik.setFieldValue('addressName', importedWalletAlias);
            }

            goToNextStep();
        } catch (error) {
            onError(error);
        } finally {
            setIsImporting(false);
        }
    };

    const handleEnteredPasswordChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        formik.setFieldValue('enteredPassphrase', evt.target.value);
    };

    return (
        <>
            <div className='mb-2 flex items-center gap-2'>
                <Heading level={3}>{t('PAGES.IMPORT_NEW_WALLET.ENTER_PASSPHRASE')}</Heading>
                {selectedNetwork.isTest() && <TestnetIcon />}
            </div>

            <HeadingDescription className='mb-8'>
                {t('PAGES.IMPORT_NEW_WALLET.ENTER_YOUR_PASSPHRASE')}
            </HeadingDescription>

            <div className='relative mb-4'>
                <PassphraseInput
                    name='enteredPassphrase'
                    value={values.enteredPassphrase}
                    onChange={handleEnteredPasswordChange}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            void handleEnterKey(event);
                        }
                    }}
                    variant={values.passphraseValidation}
                    hideValue={!showPassphrase}
                    helperText={
                        values.passphraseValidation === 'destructive'
                            ? t('PAGES.IMPORT_NEW_WALLET.INVALID_PASSPHRASE')
                            : ''
                    }
                    placeholder={t('PAGES.IMPORT_NEW_WALLET.ENTER_YOUR_PASSPHRASE_HERE')}
                    className='custom-scroll h-[104px]'
                />
            </div>

            <div className='flex items-center justify-between'>
                <ToggleSwitch
                    checked={showPassphrase}
                    onChange={() => setShowPassphrase(!showPassphrase)}
                    id='show-password'
                    title={t('ACTION.SHOW_PASSPHRASE')}
                />
            </div>

            <Button
                variant='primary'
                className='mt-auto'
                isLoading={isImporting || isValidating}
                disabled={values.passphraseValidation !== 'errorFree'}
                onClick={handleWalletImport}
            >
                {t('ACTION.CONFIRM_IMPORT')}
            </Button>
        </>
    );
};

export default EnterPassphrase;
