import { useEffect } from 'react';
import classNames from 'classnames';
import Step from './Step';
import { connectSteps } from './utils/connectionSteps';
import * as ModalStore from '@/lib/store/modal';

import { Button, ExternalLink, Heading, Icon } from '@/shared/components';

import constants from '@/constants';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useLedgerContext } from '@/lib/Ledger';
import useLoadingModal from '@/lib/hooks/useLoadingModal';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useProfileContext } from '@/lib/context/Profile';

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
        <div>
            <Heading level={3} className='mb-6'>
                Connect Your Ledger Device
            </Heading>
            <div className='my-6 flex justify-center'>
                <Icon icon='ledger-device' className='h-30 w-[13.75rem]' />
            </div>

            <div className='mb-6'>
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
