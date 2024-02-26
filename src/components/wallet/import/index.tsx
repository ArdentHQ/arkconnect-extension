import { Contracts } from '@ardenthq/sdk-profiles';
import SetupPassword from '../../settings/SetupPassword';
import StepsNavigation, { Step } from '@/components/steps/StepsNavigation';
import { FormikValues, useFormik } from 'formik';
import EnterPassphrase from './EnterPassphrase';
import ImportedWallet from './ImportedWallet';
import { ValidationVariant } from '../create';
import { useNavigate } from 'react-router-dom';
import { useProfileContext } from '@/lib/context/Profile';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useEffect, useState } from 'react';
import useNetwork from '@/lib/hooks/useNetwork';
import { getPersistedValues } from '../form-persist';
import { clearPersistScreenData } from '../form-persist/helpers';
import useWalletImport from '@/lib/hooks/useWalletImport';
import browser from 'webextension-polyfill';
import useLocaleCurrency from '@/lib/hooks/useLocalCurrency';
import { getLocalValues } from '@/lib/utils/localStorage';
import useLoadingModal from '@/lib/hooks/useLoadingModal';

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
  const { persistScreen } = getPersistedValues();
  const { importWallet } = useWalletImport({ profile });
  const { activeNetwork } = useNetwork();
  const loadingModal = useLoadingModal({
    completedMessage: 'Your Wallet is Ready!',
    loadingMessage: 'Setting up the wallet, please wait!',
  });
  const [steps, setSteps] = useState<Step[]>([
    { component: EnterPassphrase },
    { component: ImportedWallet },
  ]);
  const [defaultStep, setDefaultStep] = useState<number>(0);
  const [isGeneratingWallet, setIsGeneratingWallet] = useState(true);
  const { defaultCurrency } = useLocaleCurrency();

  useEffect(() => {
    (async () => {
      const { hasOnboarded } = await getLocalValues();
      if (!hasOnboarded) {
        setSteps([...steps, { component: SetupPassword }]);
      }

      if (persistScreen) {
        if (persistScreen.step > 0) {
          const importedWallet = await importWallet({
            network: activeNetwork,
            value: formik.values.enteredPassphrase,
          });

          if (!importedWallet) return;

          formik.setFieldValue('wallet', importedWallet);
        }

        setDefaultStep(persistScreen.step);
      }

      setIsGeneratingWallet(false);
    })();
  }, []);

  useEffect(() => {
    return () => {
      clearPersistScreenData();
    };
  }, []);

  const formik = useFormik<ImportedWalletFormik>({
    initialValues: initialImportWalletData,
    onSubmit: async (values: FormikValues, formikHelpers) => {
      loadingModal.setLoading();

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
      navigate('/');
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
