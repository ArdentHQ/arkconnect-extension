import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useNavigate } from 'react-router-dom';
import { runtime, tabs } from 'webextension-polyfill';
import SetupPassword from '../../settings/SetupPassword';
import { clearPersistScreenData } from '../form-persist/helpers';
import ConfirmPassphrase from './ConfirmPassphrase';
import GeneratePassphrase from './GeneratePassphrase';
import StepsNavigation, { Step } from '@/components/steps/StepsNavigation';
import useToast from '@/lib/hooks/useToast';
import useNetwork from '@/lib/hooks/useNetwork';
import { useProfileContext } from '@/lib/context/Profile';
import { getDefaultAlias } from '@/lib/utils/getDefaultAlias';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import { assertNetwork } from '@/lib/utils/assertions';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import useLocaleCurrency from '@/lib/hooks/useLocalCurrency';
import { getLocalValues } from '@/lib/utils/localStorage';
import useLoadingModal from '@/lib/hooks/useLoadingModal';

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
    const { activeNetwork } = useNetwork();
    const [isGeneratingWallet, setIsGeneratingWallet] = useState(true);
    const [steps, setSteps] = useState<Step[]>([
        { component: GeneratePassphrase },
        { component: ConfirmPassphrase },
    ]);
    const loadingModal = useLoadingModal({
        completedMessage: 'Your Wallet is Ready!',
        loadingMessage: 'Setting up the wallet, please wait!',
    });

    useEffect(() => {
        (async () => {
            const { hasOnboarded } = await getLocalValues();
            if (!hasOnboarded) {
                setSteps([...steps, { component: SetupPassword }]);
            }

            handleGenerateWallet();
        })();
    }, []);

    useEffect(() => {
        return () => {
            clearPersistScreenData();
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

            // Fetch updated profile data and update store.
            await initProfile();

            await loadingModal.setCompletedAndClose();

            formikHelpers.resetForm();

            navigate('/');
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

    const handleGenerateWallet = async () => {
        try {
            const response = await generateWallet();
            formik.setFieldValue('wallet', response?.wallet);
            formik.setFieldValue('passphrase', response?.mnemonic.split(' '));
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
            <StepsNavigation<CreateWalletFormik> steps={steps} formik={formik} />
        </HandleLoadingState>
    );
};

export default CreateNewWallet;
