import { useEffect } from 'react';
import classNames from 'classnames';
import Step from './Step';
import { connectSteps } from './utils/connectionSteps';
import * as ModalStore from '@/lib/store/modal';

import { Button, ExternalLink, Heading, Icon, Loader } from '@/shared/components';

import constants from '@/constants';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useLedgerContext } from '@/lib/Ledger';
import useLoadingModal from '@/lib/hooks/useLoadingModal';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useProfileContext } from '@/lib/context/Profile';

const ConnectionStep = ({ children }: { children: React.ReactNode }) => {
    return (
        <li className='flex justify-start space-x-2 text-light-black dark:text-white'>
            <span className='flex h-6 w-6 flex-shrink-0'>
                <Loader className='typeset-body h-5 w-5 border-2 border-theme-secondary-400 border-t-theme-secondary-200 dark:border-theme-secondary-300 dark:border-t-theme-secondary-600' />
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
    const loadingModal = useLoadingModal({
        completedMessage: 'Ledger Connected!',
        loadingMessage: 'Waiting for you to choose and connect a Ledger device.',
        other: {
            CTA: ModalStore.CTAType.INITIATE_LEDGER,
        },
    });

    const { connect, abortConnectionRetry, error, isConnected, accessDenied } = useLedgerContext();

    const {
        listenDevice,
        hasDeviceAvailable,
        error: ledgerError,
        resetConnectionState,
    } = useLedgerContext();

    const handleListenDevice = () => {
        loadingModal.setLoading();
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
        if (!hasDeviceAvailable) return;
        (async () => {
            try {
                await connect(activeProfile, network.coin(), network.id());
                goToNextStep();
            } catch (error) {
                onError(error);
            }
        })();
    }, [hasDeviceAvailable]);

    useEffect(() => {
        if (error) {
            onFailed?.(new Error(error));
        }
    }, [isConnected, error]);

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
                    {true && (
                        <ConnectionStep>
                            Connect your Ledger device and close other apps connected to it.
                        </ConnectionStep>
                    )}
                    {true && (
                        <ConnectionStep>
                            Choose your Ledger device in the browser window and click Connect.
                        </ConnectionStep>
                    )}
                    {true && <ConnectionStep>Unlock your Ledger device.</ConnectionStep>}
                    {true && (
                        <ConnectionStep>Open the ARK app on the Ledger device.</ConnectionStep>
                    )}
                </ul>

                {connectSteps.map((step, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <Step step={index + 1} />
                        <p
                            className={classNames(
                                'typeset-headline text-light-black dark:text-white',
                                {
                                    'mb-3': index !== connectSteps.length - 1,
                                },
                            )}
                        >
                            {step}
                        </p>
                    </div>
                ))}
            </div>
            <div className='pb-4'>
                <Button variant='primary' onClick={handleListenDevice}>
                    Continue
                </Button>
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
