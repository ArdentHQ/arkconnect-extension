import * as ModalStore from '@/lib/store/modal';

import { Container, FlexContainer, Header, Icon, Paragraph } from '@/shared/components';
import { LedgerData, useLedgerContext } from '@/lib/Ledger';
import StepsNavigation, { Step } from '@/components/steps/StepsNavigation';
import { useEffect, useState } from 'react';

import { Contracts } from '@ardenthq/sdk-profiles';
import ImportWallets from '@/components/ledger/ImportWallets';
import { LedgerConnectionStep } from '@/components/ledger/LedgerConnectionStep';
import SetupPassword from '@/components/settings/SetupPassword';
import { ThemeMode } from '@/lib/store/ui';
import browser from 'webextension-polyfill';
import { getDefaultAlias } from '@/lib/utils/getDefaultAlias';
import { getLocalValues } from '@/lib/utils/localStorage';
import styled from 'styled-components';
import { useAppDispatch } from '@/lib/store';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useFormik } from 'formik';
import useLocaleCurrency from '@/lib/hooks/useLocalCurrency';
import useNetwork from '@/lib/hooks/useNetwork';
import { useProfileContext } from '@/lib/context/Profile';
import useThemeMode from '@/lib/hooks/useThemeMode';

export type ImportWithLedger = {
  wallets: LedgerData[];
  importedWallets: Contracts.IReadWriteWallet[];
  completed: boolean;
  password: string;
  passwordConfirm: string;
};

const ImportWithLedger = () => {
  const { currentThemeMode } = useThemeMode();
  const { activeNetwork: network } = useNetwork();
  const { profile, initProfile } = useProfileContext();
  const { defaultCurrency } = useLocaleCurrency();
  const dispatch = useAppDispatch();
  const { error, removeErrors } = useLedgerContext();
  const { onError } = useErrorHandlerContext();
  const [steps, setSteps] = useState<Step[]>([
    { component: LedgerConnectionStep },
    { component: ImportWallets },
  ]);

  const formik = useFormik<ImportWithLedger>({
    initialValues: {
      wallets: [],
      importedWallets: [],
      completed: false,
      password: '',
      passwordConfirm: '',
    },
    onSubmit: async (values, formikHelpers) => {
      console.log(values);
      const wallets = values.wallets.map((wallet, idx) => {
        return {
          address: wallet.address,
          network: 'ark.mainnet',
          coin: 'ARK',
          path: wallet.path,
          alias: `Ledger ${idx}`,
        };
      });

      const { error } = await browser.runtime.sendMessage({
        type: 'IMPORT_WALLETS',
        data: {
          currency: defaultCurrency,
          password: values.password,
          wallets,
        },
      });

      if (error) {
        onError(error);
        return;
      }

      await initProfile();

      dispatch(
        ModalStore.loadingModalUpdated({
          isOpen: true,
          isLoading: false,
          loadingMessage: 'Setting up your wallet',
          completedMessage: 'Your wallet is ready!',
          completedDescription: 'You can now open the extension and manage your addresses!',
        }),
      );

      formikHelpers.resetForm();
    },
  });

  useEffect(() => {
    (async () => {
      const { hasOnboarded } = await getLocalValues();
      if (!hasOnboarded) {
        setSteps([...steps, { component: SetupPassword }]);
      }
    })();
  }, []);

  return (
    <Container width='100vw' minHeight='100vh' backgroundColor='primaryBackground'>
      <Header />
      <FlexContainer
        alignItems='center'
        justifyContent='center'
        width='100%'
        minHeight='100vh'
        pt='56'
      >
        <FlexContainer justifyContent='center' alignItems='center' height='100%'>
          <Container p='24' width='355px' backgroundColor='secondaryBackground' borderRadius='8'>
            <StepsNavigation steps={steps} formik={formik} disabledSteps={[0, 2]} />
          </Container>
        </FlexContainer>
        {error && (
          <LedgerError themeMode={currentThemeMode}>
            <FlexContainer alignItems='center' gridGap='24px'>
              <FlexContainer alignItems='center' gridGap='8px'>
                <Icon
                  icon='information-circle'
                  width='20px'
                  height='20px'
                  color='ledgerErrorText'
                />
                <Paragraph color='ledgerConnectionError' $typeset='body' fontWeight='regular'>
                  {error && error.message ? error.message : error}
                </Paragraph>
              </FlexContainer>
              <Container p='8' onClick={removeErrors}>
                <Icon
                  icon='x'
                  width='16px'
                  height='16px'
                  color='ledgerErrorText'
                  className='c-pointer'
                />
              </Container>
            </FlexContainer>
          </LedgerError>
        )}
      </FlexContainer>
    </Container>
  );
};

const LedgerError = styled(Container)<{ themeMode: ThemeMode }>`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 15;
  padding: 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.themeMode === ThemeMode.LIGHT ? props.theme.colors.error50 : 'rgba(255, 86, 74, 0.26)'};
  border-top: 1px solid
    ${(props) =>
      props.themeMode === ThemeMode.LIGHT
        ? props.theme.colors.error300
        : props.theme.colors.error500};
`;

export default ImportWithLedger;
