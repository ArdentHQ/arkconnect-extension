import { useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { Contracts } from '@ardenthq/sdk-profiles';
import browser from 'webextension-polyfill';
import { clearPersistScreenData, persistScreenChanged } from '../form-persist/helpers';
import { WalletFormScreen } from '../form-persist';
import { ImportedWalletFormik } from '.';
import {
    Button,
    Container,
    FlexContainer,
    Heading,
    Paragraph,
    PassphraseInput,
    ToggleSwitch,
} from '@/shared/components';
import useWalletImport from '@/lib/hooks/useWalletImport';
import { useProfileContext } from '@/lib/context/Profile';
import useWalletSync from '@/lib/hooks/useWalletSync';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { getDefaultAlias } from '@/lib/utils/getDefaultAlias';
import useNetwork from '@/lib/hooks/useNetwork';
import { assertWallet } from '@/lib/utils/assertions';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useAppSelector } from '@/lib/store';
import { selectWalletsIds } from '@/lib/store/wallet';

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
    const { activeNetwork } = useNetwork();
    const { profile, initProfile } = useProfileContext();
    const { onError } = useErrorHandlerContext();
    const { env } = useEnvironmentContext();
    const { syncAll } = useWalletSync({ env, profile });
    const { importWallet } = useWalletImport({ profile });
    const [submitAfterValidation, setSubmitAfterValidation] = useState<boolean>(false);

    useEffect(() => {
        setSubmitAfterValidation(false);

        void validatePassphrase();
    }, [values.enteredPassphrase]);

    useEffect(() => {
        persistScreenChanged({
            screen: WalletFormScreen.IMPORT,
            step: 0,
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
                    await browser.runtime.sendMessage({
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

                    clearPersistScreenData();

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
            <Heading $typeset='h3' fontWeight='bold' color='base' mb='8'>
                Enter Passphrase
            </Heading>
            <Paragraph $typeset='headline' color='gray' mb='24'>
                Enter your 12 or 24-word passphrase that you were given when you created the
                address.
            </Paragraph>
            <Container mb='16' position='relative'>
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
                            ? 'Invalid passphrase. Please check again.'
                            : ''
                    }
                    placeholder='Paste your 12 or 24-word passphrase here'
                    height='104px'
                    className='custom-scroll'
                />
            </Container>

            <FlexContainer justifyContent='space-between' alignItems='center'>
                <ToggleSwitch
                    checked={showPassphrase}
                    onChange={() => setShowPassphrase(!showPassphrase)}
                    id='show-password'
                    title='Show Passphrase'
                />
            </FlexContainer>

            <Button
                variant='primary'
                mt='auto'
                isLoading={isImporting || isValidating}
                disabled={values.passphraseValidation !== 'errorFree'}
                onClick={handleWalletImport}
            >
                Confirm & Import
            </Button>
        </>
    );
};

export default EnterPassphrase;
