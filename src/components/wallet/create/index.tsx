import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useNavigate } from 'react-router-dom';
import { runtime } from 'webextension-polyfill';
import SetupPassword from '../../settings/SetupPassword';
import ConfirmPassphrase from './ConfirmPassphrase';
import GeneratePassphrase from './GeneratePassphrase';
import StepsNavigation, { Step } from '@/components/steps/StepsNavigation';
import useToast from '@/lib/hooks/useToast';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useProfileContext } from '@/lib/context/Profile';
import { getDefaultAlias } from '@/lib/utils/getDefaultAlias';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import { assertNetwork } from '@/lib/utils/assertions';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import useLocaleCurrency from '@/lib/hooks/useLocalCurrency';
import { getLocalValues } from '@/lib/utils/localStorage';
import { LastVisitedPage, ProfileData, ScreenName } from '@/lib/background/contracts';
import randomWordPositions from '@/lib/utils/randomWordPositions';
import useLoadingModal from '@/lib/hooks/useLoadingModal';
import { useBackgroundEvents } from '@/lib/context/BackgroundEventHandler';

export type CreateWalletFormik = {
    wallet?: Contracts.IReadWriteWallet;
    passphrase: string[];
    confirmPassphrase: string[];
    confirmationNumbers: number[];
    passphraseValidationStatus: ValidationVariant[];
    lostPasswordAwareness: boolean;
    password?: string;
    passwordConfirm?: string;
    termsAndConditionsConfirmed: boolean;
};

const initialCreateWalletData = {
    passphrase: [],
    confirmPassphrase: ['', '', ''],
    confirmationNumbers: [],
    passphraseValidationStatus: Array(3).fill('primary'),
    lostPasswordAwareness: false,
    termsAndConditionsConfirmed: false,
};

export type ValidationVariant = 'primary' | 'destructive' | 'errorFree';

const CreateNewWallet = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { onError } = useErrorHandlerContext();
    const { profile, initProfile } = useProfileContext();
    const { defaultCurrency } = useLocaleCurrency();
    const activeNetwork = useActiveNetwork();
    const [isGeneratingWallet, setIsGeneratingWallet] = useState(true);
    const [steps, setSteps] = useState<Step[]>([
        { component: GeneratePassphrase },
        { component: ConfirmPassphrase },
    ]);
    const [defaultStep, setDefaultStep] = useState(0);

    const loadingModal = useLoadingModal({
        completedMessage: 'Your Wallet is Ready!',
        loadingMessage: 'Setting up the wallet, please wait!',
    });

    const { events } = useBackgroundEvents();

    useEffect(() => {
        (async () => {
            const { hasOnboarded } = await getLocalValues();
            const lastVisitedPage = profile.settings().get(ProfileData.LastVisitedPage) as
                | LastVisitedPage
                | undefined;

            if (lastVisitedPage && lastVisitedPage.name === ScreenName.CreateWallet) {
                setIsGeneratingWallet(true);

                const mnemonic = lastVisitedPage.data.mnemonic;
                const network = lastVisitedPage.data.network;
                const coin = lastVisitedPage.data.coin;
                const confirmationNumbers = lastVisitedPage.data.confirmationNumbers;
                const confirmPassphrase = lastVisitedPage.data.confirmPassphrase;
                const step = lastVisitedPage.data.step;

                if (mnemonic && network && coin) {
                    const wallet = await profile.walletFactory().fromMnemonicWithBIP39({
                        coin,
                        network,
                        mnemonic,
                    });

                    formik.setFieldValue('confirmationNumbers', confirmationNumbers);
                    formik.setFieldValue('wallet', wallet);
                    formik.setFieldValue('passphrase', mnemonic.split(' '));

                    if (confirmPassphrase) {
                        formik.setFieldValue('confirmPassphrase', confirmPassphrase);
                    }

                    if (step) {
                        setDefaultStep(step);
                    }
                }

                if (!hasOnboarded) {
                    setSteps([...steps, { component: SetupPassword }]);
                }

                setIsGeneratingWallet(false);

                return;
            }

            if (!hasOnboarded) {
                setSteps([...steps, { component: SetupPassword }]);
            }

            handleGenerateWallet();
        })();
    }, []);

    useEffect(() => {
        return () => {
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget(ProfileData.LastVisitedPage);
        };
    }, []);

    const formik = useFormik<CreateWalletFormik>({
        initialValues: initialCreateWalletData,
        onSubmit: async (values, formikHelpers) => {
            loadingModal.setLoading();

            if (!values.wallet) {
                toast('danger', 'Something went wrong while creating your wallet');
                onError('Failed to generate wallet.');
                return;
            }

            const { error } = await runtime.sendMessage({
                type: 'IMPORT_WALLETS',
                data: {
                    currency: defaultCurrency,
                    password: values.password,
                    wallets: [
                        {
                            address: values.wallet.address(),
                            network: values.wallet.network().id(),
                            coin: values.wallet.network().coin(),
                            alias: getDefaultAlias({ profile, network: values.wallet.network() }),
                            mnemonic: values.passphrase.join(' '),
                        },
                    ],
                },
            });

            if (error) {
                onError(error);
                return;
            }

            await runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });

            // Fetch updated profile data and update store.
            await initProfile();

            await loadingModal.setCompletedAndClose();

            formikHelpers.resetForm();

            if (events.length === 0) {
                navigate('/');
            }
        },
    });

    const generateWallet = () => {
        assertNetwork(activeNetwork);

        const locale = profile
            .settings()
            .get<string>(Contracts.ProfileSetting.Bip39Locale, 'english');

        return profile.walletFactory().generate({
            coin: activeNetwork.coin(),
            locale,
            network: activeNetwork.id(),
            wordCount: activeNetwork.wordCount(),
        });
    };

    // Persist the exact step if user goes back 'n forth.
    const handleStepChange = async (step: number) => {
        if (step === -1) {
            const { hasOnboarded } = await getLocalValues();
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget(ProfileData.LastVisitedPage);

            if (hasOnboarded) {
                return navigate('/create-import-address');
            }

            return navigate('/onboarding');
        }

        if (step === 0) {
            const confirmationNumbers = randomWordPositions(24);
            formik.setFieldValue('confirmationNumbers', confirmationNumbers);
            formik.setFieldValue('confirmPassphrase', ['', '', '']);

            runtime.sendMessage({
                type: 'SET_LAST_SCREEN',
                name: ScreenName.CreateWallet,
                data: {
                    step,
                    mnemonic: formik.values.passphrase.join(' '),
                    network: activeNetwork.id(),
                    coin: activeNetwork.coin(),
                    confirmationNumbers,
                },
            });
            return;
        }

        runtime.sendMessage({
            type: 'SET_LAST_SCREEN',
            name: ScreenName.CreateWallet,
            data: {
                step,
                mnemonic: formik.values.passphrase.join(' '),
                network: activeNetwork.id(),
                coin: activeNetwork.coin(),
                confirmationNumbers: formik.values.confirmationNumbers,
            },
        });
    };

    const handleGenerateWallet = async () => {
        try {
            const response = await generateWallet();

            const confirmationNumbers = randomWordPositions(24);

            formik.setFieldValue('confirmationNumbers', confirmationNumbers);
            formik.setFieldValue('wallet', response.wallet);
            formik.setFieldValue('passphrase', response.mnemonic.split(' '));

            await runtime.sendMessage({
                type: 'SET_LAST_SCREEN',
                name: ScreenName.CreateWallet,
                data: {
                    step: 0,
                    mnemonic: response?.mnemonic,
                    network: activeNetwork.id(),
                    coin: activeNetwork.coin(),
                    confirmationNumbers,
                },
            });
        } catch (error) {
            onError(error, false);
        } finally {
            setIsGeneratingWallet(false);
        }
    };

    return (
        <HandleLoadingState
            loading={
                isGeneratingWallet || !formik.values.passphrase.length || loadingModal.isLoading
            }
        >
            <StepsNavigation<CreateWalletFormik>
                defaultStep={defaultStep}
                steps={steps}
                formik={formik}
                onStepChange={handleStepChange}
            />
        </HandleLoadingState>
    );
};

export default CreateNewWallet;
