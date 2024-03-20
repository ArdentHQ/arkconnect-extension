import { useEffect, useState } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import { runtime } from 'webextension-polyfill';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Header, Icon } from '@/shared/components';
import { LedgerData, useLedgerContext } from '@/lib/Ledger';
import StepsNavigation, { Step } from '@/components/steps/StepsNavigation';

import ImportWallets from '@/components/ledger/ImportWallets';
import { LedgerConnectionStep } from '@/components/ledger/LedgerConnectionStep';
import SetupPassword from '@/components/settings/SetupPassword';
import { getLedgerAlias } from '@/lib/utils/getDefaultAlias';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import useLoadingModal from '@/lib/hooks/useLoadingModal';
import useLocaleCurrency from '@/lib/hooks/useLocalCurrency';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useProfileContext } from '@/lib/context/Profile';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { EnvironmentData } from '@/lib/background/contracts';

export type ImportWithLedger = {
    wallets: LedgerData[];
    importedWallets: Contracts.IReadWriteWallet[];
    completed: boolean;
    password: string;
    passwordConfirm: string;
};

const ImportWithLedger = () => {
    const network = useActiveNetwork();
    const { profile, initProfile } = useProfileContext();
    const { defaultCurrency } = useLocaleCurrency();
    const { error, removeErrors, resetConnectionState, disconnect, abortConnectionRetry } =
        useLedgerContext();
    const { onError } = useErrorHandlerContext();
    const { t } = useTranslation();
    const handleClickBack = () => {
        disconnect();
        abortConnectionRetry();
        resetConnectionState();
    };

    const [steps, setSteps] = useState<Step[]>([
        { component: LedgerConnectionStep, containerPaddingX: '24' },
        { component: ImportWallets, onClickBack: handleClickBack },
    ]);
    const { env } = useEnvironmentContext();

    const loadingModal = useLoadingModal({
        loadingMessage: t('PAGES.IMPORT_WITH_LEDGER.FEEDBACK.SETTING_UP_YOUR_WALLET'),
        completedMessage: t('PAGES.IMPORT_WITH_LEDGER.FEEDBACK.YOUR_WALLET_IS_READY'),
        other: {
            completedDescription: t(
                'PAGES.IMPORT_WITH_LEDGER.FEEDBACK.OPEN_THE_EXTENSION_AND_MANAGE_YOUR_ADDRESSES',
            ),
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
            if (!env.data().get(EnvironmentData.HasOnboarded)) {
                setSteps([...steps, { component: SetupPassword, containerPaddingX: '24' }]);
            }
        })();
    }, []);

    return (
        <div className='min-h-screen w-screen bg-subtle-white dark:bg-light-black'>
            <Header hideNavbar />
            <div className='flex min-h-screen w-full items-center justify-center pt-14'>
                <div className='flex h-full items-center justify-center'>
                    <div className='w-[355px] rounded-lg bg-white py-6 dark:bg-subtle-black'>
                        <StepsNavigation
                            steps={steps}
                            formik={formik}
                            disabledSteps={[0, 2]}
                            className='px-6'
                        />
                    </div>
                </div>
                {error && (
                    <div className='fixed bottom-0 left-0 z-20 flex w-full items-center justify-center border-t border-t-theme-error-300 bg-theme-error-50 px-2 py-2 dark:border-t-theme-error-500 dark:bg-[rgba(255,86,74,0.26)]'>
                        <div className='flex h-8 items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <Icon
                                    icon='information-circle'
                                    className='h-5 w-5 text-theme-error-600 dark:text-white'
                                />
                                <p className='typeset-body text-theme-error-600 dark:text-white'>
                                    {error && error.message ? error.message : error}
                                </p>
                            </div>
                            <div className='p-2' onClick={removeErrors}>
                                <Icon
                                    icon='x'
                                    className='h-4 w-4 cursor-pointer text-theme-error-600 dark:text-white'
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportWithLedger;
