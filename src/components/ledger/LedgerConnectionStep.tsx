import { useEffect } from 'react';

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

    const {
        connect,
        abortConnectionRetry,
        accessDenied,
        listenDevice,
        hasDeviceAvailable,
        error: ledgerError,
        ledgerDevice,
        isConnected,
        isBusy,
        isAwaitingDeviceConfirmation,
        isAwaitingConnection,
        resetConnectionState,
    } = useLedgerContext();

    const handleListenDevice = () => {
        listenDevice();
    };

    useEffect(() => {
        const notAvailableErrors = [
            `Failed to execute ${'requestDevice'} on 'HID'`,
            'Access denied to use Ledger device',
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
        console.log({
            ledgerError,
            ledgerDevice,
            isConnected,
            isBusy,
            isAwaitingDeviceConfirmation,
            isAwaitingConnection,
        });
        if (!hasDeviceAvailable) return;

        (async () => {
            try {
                await connect(activeProfile, network.coin(), network.id());
                // goToNextStep();
            } catch (error) {
                onError(error);
            }
        })();
    }, [
        ledgerDevice,
        isConnected,
        isBusy,
        isAwaitingDeviceConfirmation,
        isAwaitingConnection,
        ledgerError,
    ]);

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

    return (
        <div className='space-y-6'>
            <div>
                <Heading level={3} className='mb-2'>
                    Connect Your Ledger Device
                </Heading>

                <p className='typehead-body text-theme-secondary-500 dark:text-theme-secondary-300'>
                    Please complete the steps mentioned below to connect your Ledger.
                </p>
            </div>

            <div className='my-6 flex justify-center'>
                <Icon icon='ledger-device' className='h-30 w-[13.75rem]' />
            </div>

            <div className='mb-6'>
                <ul className='flex flex-col space-y-3'>
                    <ConnectionStep ready={hasDeviceAvailable}>
                        Connect your Ledger device and close other apps connected to it.
                    </ConnectionStep>

                    <ConnectionStep ready={ledgerDevice !== undefined}>
                        Choose your Ledger device in the browser window and click Connect.
                    </ConnectionStep>

                    <ConnectionStep ready={ledgerDevice !== undefined}>
                        Unlock your Ledger device.
                    </ConnectionStep>

                    <ConnectionStep ready={isConnected}>
                        Open the ARK app on the Ledger device.
                    </ConnectionStep>
                </ul>
            </div>
            <div className='pb-4'>
                {isConnected ? (
                    <Button variant='primary' onClick={goToNextStep}>
                        Continue
                    </Button>
                ) : (
                    <Button variant='primary' onClick={handleListenDevice}>
                        Connect
                    </Button>
                )}
            </div>
            <ExternalLink
                className='flex w-full items-center justify-center gap-3 text-theme-primary-700 dark:text-theme-primary-650'
                href={`mailto:${constants.SUPPORT_EMAIL}?subject=ARK%20Connect%20Support%20Ledger`}
            >
                <p className='typeset-headline font-medium'>Support Email</p>
                <Icon icon='link-external' className='h-5 w-5' />
            </ExternalLink>
        </div>
    );
};
