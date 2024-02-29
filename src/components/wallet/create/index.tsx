import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useNavigate } from 'react-router-dom';
import browser from 'webextension-polyfill';
import SetupPassword from '../../settings/SetupPassword';
import ConfirmPassphrase from './ConfirmPassphrase';
import GeneratePassphrase from './GeneratePassphrase';
import StepsNavigation, { Step } from '@/components/steps/StepsNavigation';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectLoadingModal, loadingModalUpdated } from '@/lib/store/modal';
import useToast from '@/lib/hooks/useToast';
import useNetwork from '@/lib/hooks/useNetwork';
import { useProfileContext } from '@/lib/context/Profile';
import { getDefaultAlias } from '@/lib/utils/getDefaultAlias';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import { assertNetwork } from '@/lib/utils/assertions';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import useLocaleCurrency from '@/lib/hooks/useLocalCurrency';
import { getLocalValues } from '@/lib/utils/localStorage';
import { LastScreen, ProfileData, ScreenName } from '@/lib/background/contracts';
import randomWordPositions from '@/lib/utils/randomWordPositions';

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
    const dispatch = useAppDispatch();
    const { onError } = useErrorHandlerContext();
    const { profile, initProfile } = useProfileContext();
    const { defaultCurrency } = useLocaleCurrency();
    const { activeNetwork } = useNetwork();
    const [isGeneratingWallet, setIsGeneratingWallet] = useState(true);
    const loadingModal = useAppSelector(selectLoadingModal);
    const [steps, setSteps] = useState<Step[]>([
        { component: GeneratePassphrase },
        { component: ConfirmPassphrase },
    ]);
    const [defaultStep, setDefaultStep] = useState(0);

    useEffect(() => {
        (async () => {
            const { hasOnboarded } = await getLocalValues();
            const lastScreen = profile.data().get(ProfileData.LastScreen) as LastScreen | undefined;

            if (lastScreen && lastScreen.screenName === ScreenName.CreateWallet) {
                setIsGeneratingWallet(true);

                const mnemonic = lastScreen.data.mnemonic;
                const network = lastScreen.data.network;
                const coin = lastScreen.data.coin;
                const confirmationNumbers = lastScreen.data.confirmationNumbers;
                const confirmPassphrase = lastScreen.data.confirmPassphrase;
                const step = lastScreen.data.step;

                if (mnemonic && mnemonic && coin) {
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

                    if (step === 1) {
                        setDefaultStep(1);
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
            browser.runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
        };
    }, []);

    const formik = useFormik<CreateWalletFormik>({
        initialValues: initialCreateWalletData,
        onSubmit: async (values, formikHelpers) => {
            const loadingModal = {
                isOpen: true,
                isLoading: true,
                completedMessage: 'Your Wallet is Ready!',
                loadingMessage: 'Setting up the wallet, please wait!',
            };

            dispatch(loadingModalUpdated(loadingModal));

            if (!values.wallet) {
                toast('danger', 'Something went wrong while creating your wallet');
                onError('Failed to generate wallet.');
                return;
            }

            const { error } = await browser.runtime.sendMessage({
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

            await browser.runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });

            // Fetch updated profile data and update store.
            await initProfile();

            setTimeout(() => {
                dispatch(
                    loadingModalUpdated({
                        ...loadingModal,
                        isOpen: false,
                        isLoading: false,
                    }),
                );

                formikHelpers.resetForm();
                navigate('/');
            }, 500);
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
    const handleStepChange = (step: number) => {
        if (step === -1) {
            browser.runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            return;
        }

        browser.runtime.sendMessage({
            type: 'SET_LAST_SCREEN',
            screenName: ScreenName.CreateWallet,
            data: {
                step: step,
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

            await browser.runtime.sendMessage({
                type: 'SET_LAST_SCREEN',
                screenName: ScreenName.CreateWallet,
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
            loading={isGeneratingWallet || !formik.values.passphrase.length || loadingModal.isOpen}
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
