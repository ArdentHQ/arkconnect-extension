import { useEffect, useState } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import { runtime } from 'webextension-polyfill';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { Container, FlexContainer, Header, Icon, Paragraph } from '@/shared/components';
import { LedgerData, useLedgerContext } from '@/lib/Ledger';
import StepsNavigation, { Step } from '@/components/steps/StepsNavigation';

import ImportWallets from '@/components/ledger/ImportWallets';
import { LedgerConnectionStep } from '@/components/ledger/LedgerConnectionStep';
import SetupPassword from '@/components/settings/SetupPassword';
import { ThemeMode } from '@/lib/store/ui';
import { getLedgerAlias } from '@/lib/utils/getDefaultAlias';
import { getLocalValues } from '@/lib/utils/localStorage';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import useLoadingModal from '@/lib/hooks/useLoadingModal';
import useLocaleCurrency from '@/lib/hooks/useLocalCurrency';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
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
    const network = useActiveNetwork();
    const { profile, initProfile } = useProfileContext();
    const { defaultCurrency } = useLocaleCurrency();
    const { error, removeErrors } = useLedgerContext();
    const { onError } = useErrorHandlerContext();
    const [steps, setSteps] = useState<Step[]>([
        { component: LedgerConnectionStep, containerPaddingX: '24' },
        { component: ImportWallets },
    ]);
    const loadingModal = useLoadingModal({
        loadingMessage: 'Setting up your wallet',
        completedMessage: 'Your wallet is ready!',
        other: {
            completedDescription: 'You can now open the extension and manage your addresses!',
        },
    });

    const formik = useFormik<ImportWithLedger>({
        initialValues: {
            wallets: [],
            importedWallets: [],
            completed: false,
            password: '',
            passwordConfirm: '',
        },
        onSubmit: async (values, formikHelpers) => {
            const wallets = values.wallets.map((wallet, index) => {
                return {
                    address: wallet.address,
                    network: network.id(),
                    coin: network.coin(),
                    path: wallet.path,
                    alias: getLedgerAlias({
                        network,
                        profile,
                        importCount: values.wallets.length,
                        index,
                    }),
                };
            });

            const { error } = await runtime.sendMessage({
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

            loadingModal.open();

            formikHelpers.resetForm();
        },
    });

    useEffect(() => {
        (async () => {
            const { hasOnboarded } = await getLocalValues();
            if (!hasOnboarded) {
                setSteps([...steps, { component: SetupPassword, containerPaddingX: '24' }]);
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
                    <Container
                        py='24'
                        width='355px'
                        backgroundColor='secondaryBackground'
                        borderRadius='8'
                    >
                        <StepsNavigation
                            steps={steps}
                            formik={formik}
                            disabledSteps={[0, 2]}
                            px='24'
                        />
                    </Container>
                </FlexContainer>
                {error && (
                    <LedgerError themeMode={currentThemeMode}>
                        <FlexContainer alignItems='center' gridGap='24px'>
                            <FlexContainer alignItems='center' gridGap='8px'>
                                <Icon
                                    icon='information-circle'
                                    className='h-5 w-5 text-theme-error-600 dark:text-white'
                                />
                                <Paragraph
                                    color='ledgerConnectionError'
                                    $typeset='body'
                                    fontWeight='regular'
                                >
                                    {error && error.message ? error.message : error}
                                </Paragraph>
                            </FlexContainer>
                            <Container p='8' onClick={removeErrors}>
                                <Icon
                                    icon='x'
                                    className='c-pointer h-4 w-4 text-theme-error-600 dark:text-white'
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
        props.themeMode === ThemeMode.LIGHT
            ? props.theme.colors.error50
            : 'rgba(255, 86, 74, 0.26)'};
    border-top: 1px solid
        ${(props) =>
            props.themeMode === ThemeMode.LIGHT
                ? props.theme.colors.error300
                : props.theme.colors.error500};
`;

export default ImportWithLedger;
