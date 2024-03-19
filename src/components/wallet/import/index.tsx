import { Contracts } from '@ardenthq/sdk-profiles';
import { FormikValues, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import SetupPassword from '../../settings/SetupPassword';
import { ValidationVariant } from '../create';
import EnterPassphrase from './EnterPassphrase';
import ImportedWallet from './ImportedWallet';
import StepsNavigation, { Step } from '@/components/steps/StepsNavigation';
import { useProfileContext } from '@/lib/context/Profile';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import useWalletImport from '@/lib/hooks/useWalletImport';
import useLocaleCurrency from '@/lib/hooks/useLocalCurrency';
import useLoadingModal from '@/lib/hooks/useLoadingModal';
import { useBackgroundEvents } from '@/lib/context/BackgroundEventHandler';
import {
    EnvironmentData,
    LastVisitedPage,
    ProfileData,
    ScreenName,
} from '@/lib/background/contracts';

import { useEnvironmentContext } from '@/lib/context/Environment';
export type ImportedWalletFormik = {
    enteredPassphrase: string;
    wallet?: Contracts.IReadWriteWallet;
    password: string;
    passwordConfirm: string;
    passphraseValidation: ValidationVariant;
    addressName: string;
    termsAndConditionsConfirmed: boolean;
};

const initialImportWalletData = {
    enteredPassphrase: '',
    wallet: undefined,
    password: '',
    passwordConfirm: '',
    passphraseValidation: 'primary' as ValidationVariant,
    addressName: '',
    termsAndConditionsConfirmed: false,
};

const ImportNewWallet = () => {
    const navigate = useNavigate();
    const { profile, initProfile } = useProfileContext();
    const { onError } = useErrorHandlerContext();
    const { importWallet } = useWalletImport({ profile });
    const { t } = useTranslation();
    const activeNetwork = useActiveNetwork();
    const loadingModal = useLoadingModal({
        completedMessage: t('PAGES.IMPORT_NEW_WALLET.FEEDBACK.YOUR_WALLET_IS_READY'),
        loadingMessage: t('PAGES.IMPORT_NEW_WALLET.FEEDBACK.SETTING_UP_THE_WALLET'),
    });
    const [steps, setSteps] = useState<Step[]>([
        { component: EnterPassphrase },
        { component: ImportedWallet },
    ]);
    const [defaultStep, setDefaultStep] = useState<number>(0);
    const [isGeneratingWallet, setIsGeneratingWallet] = useState(true);
    const { defaultCurrency } = useLocaleCurrency();
    const { env } = useEnvironmentContext();

    const { events } = useBackgroundEvents();

    useEffect(() => {
        (async () => {
            if (!env.data().get(EnvironmentData.HasOnboarded)) {
                setSteps([...steps, { component: SetupPassword }]);
            }

            const lastVisitedPage = profile.settings().get(ProfileData.LastVisitedPage) as
                | LastVisitedPage
                | undefined;

            if (lastVisitedPage?.path === ScreenName.ImportWallet) {
                if (lastVisitedPage.data.step > 0) {
                    const importedWallet = await importWallet({
                        network: activeNetwork,
                        value: formik.values.enteredPassphrase,
                    });

                    if (!importedWallet) return;

                    formik.setFieldValue('wallet', importedWallet);
                }

                setDefaultStep(lastVisitedPage.data.step);
            }

            setIsGeneratingWallet(false);
        })();
    }, []);

    useEffect(() => {
        return () => {
            void runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
        };
    }, []);

    const formik = useFormik<ImportedWalletFormik>({
        initialValues: initialImportWalletData,
        onSubmit: async (values: FormikValues, formikHelpers) => {
            loadingModal.setLoading();

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
                            alias: formik.values.addressName,
                            mnemonic: values.enteredPassphrase,
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

            if (events.length === 0) {
                navigate('/');
            }
        },
    });

    return (
        <HandleLoadingState loading={isGeneratingWallet || loadingModal.isLoading}>
            <StepsNavigation<ImportedWalletFormik>
                steps={steps}
                formik={formik}
                defaultStep={defaultStep}
            />
        </HandleLoadingState>
    );
};

export default ImportNewWallet;
