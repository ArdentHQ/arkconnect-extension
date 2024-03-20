import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Button, ExternalLink, Heading, Icon, Loader } from '@/shared/components';

import constants from '@/constants';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useLedgerContext } from '@/lib/Ledger';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useProfileContext } from '@/lib/context/Profile';

const ConnectionStep = ({ children, ready }: { children: React.ReactNode; ready: boolean }) => {
    return (
        <li className='flex justify-start space-x-2 text-light-black dark:text-white'>
            <span className='mt-px flex flex-shrink-0'>
                {ready ? (
                    <span className='flex h-5 w-5 items-center justify-center rounded-full bg-theme-primary-700 dark:bg-theme-primary-600'>
                        <Icon icon='check' className='h-4 w-4 text-white dark:text-subtle-black' />
                    </span>
                ) : (
                    <Loader className='typeset-body h-5 w-5 border-2 border-theme-secondary-400 border-t-theme-secondary-200 dark:border-theme-secondary-300 dark:border-t-theme-secondary-600' />
                )}
            </span>

            <span>{children}</span>
        </li>
    );
};

export const LedgerConnectionStep = ({
    goToNextStep,
    onFailed,
}: {
    goToNextStep: () => void;
    onConnect?: () => void;
    onFailed?: (error: Error) => void;
}) => {
    const { profile: activeProfile } = useProfileContext();
    const { onError } = useErrorHandlerContext();
    const network = useActiveNetwork();
    const { t } = useTranslation();

    const {
        connect,
        abortConnectionRetry,
        accessDenied,
        listenDevice,
        hasDeviceAvailable,
        error: ledgerError,
        isConnected,
        resetConnectionState,
    } = useLedgerContext();

    const handleListenDevice = async () => {
        await listenDevice();
    };

    useEffect(() => {
        const notAvailableErrors = [
            t('PAGES.IMPORT_WITH_LEDGER.ERRORS.FAILED_TO_REQUEST_DEVICE'),
            t('PAGES.IMPORT_WITH_LEDGER.ERRORS.ACCESS_DENED_TO_USE_LEDGER_DEVICE'),
        ];

        if (
            typeof ledgerError === 'string' &&
            notAvailableErrors.some((errorMessage) => ledgerError.includes(errorMessage))
        ) {
            // Make sure to clear errors.
            resetConnectionState();
            accessDenied();
        }
    }, [ledgerError]);

    useEffect(() => {
        if (!hasDeviceAvailable) return;

        (async () => {
            try {
                await connect(activeProfile, network.coin(), network.id());
            } catch (error) {
                onError(error);
            }
        })();
    }, [hasDeviceAvailable]);

    useEffect(() => {
        if (ledgerError) {
            onFailed?.(new Error(ledgerError));
        }
    }, [isConnected, ledgerError]);

    useEffect(
        () => () => {
            abortConnectionRetry();
        },
        [abortConnectionRetry],
    );

    const continueToNextStep = async () => {
        try {
            await connect(activeProfile, network.coin(), network.id());

            goToNextStep();
        } catch (error) {
            onError(error);
        }
    };

    return (
        <div className='space-y-6'>
            <div>
                <Heading level={3} className='mb-2'>
                    {t('PAGES.IMPORT_WITH_LEDGER.CONNECT_YOUR_LEDGER_DEVICE')}
                </Heading>

                <p className='typehead-body text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {t('PAGES.IMPORT_WITH_LEDGER.COMPLETE_STEPS_TO_CONNECT')}
                </p>
            </div>

            <div className='my-6 flex justify-center'>
                <Icon icon='ledger-device' className='h-30 w-[13.75rem]' />
            </div>

            <div className='mb-6'>
                <ul className='flex flex-col space-y-3'>
                    <ConnectionStep ready={isConnected || hasDeviceAvailable}>
                        {t('PAGES.IMPORT_WITH_LEDGER.CONNECT_STEPS.CONNECT_YOUR_LEDGER')}
                    </ConnectionStep>

                    <ConnectionStep ready={isConnected || hasDeviceAvailable}>
                        {t('PAGES.IMPORT_WITH_LEDGER.CONNECT_STEPS.CLICK_CONNECT')}
                    </ConnectionStep>

                    <ConnectionStep ready={isConnected}>
                        {t('PAGES.IMPORT_WITH_LEDGER.CONNECT_STEPS.UNLOCK_AND_OPEN')}
                    </ConnectionStep>
                </ul>
            </div>
            <div className='pb-4'>
                {hasDeviceAvailable ? (
                    <Button variant='primary' onClick={continueToNextStep} disabled={!isConnected}>
                        {t('ACTION.CONTINUE')}
                    </Button>
                ) : (
                    <Button variant='primary' onClick={handleListenDevice}>
                        {t('ACTION.CONNECT')}
                    </Button>
                )}
            </div>
            <ExternalLink
                className='flex w-full items-center justify-center gap-3 text-theme-primary-700 dark:text-theme-primary-650'
                href={`mailto:${constants.SUPPORT_EMAIL}?subject=${encodeURIComponent(t('MISC.ARK_CONNECT_SUPPORT_LEDGER'))}`}
            >
                <p className='typeset-headline font-medium'>{t('MISC.SUPPORT_EMAIL')}</p>
                <Icon icon='link-external' className='h-5 w-5' />
            </ExternalLink>
        </div>
    );
};
