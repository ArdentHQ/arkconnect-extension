import { useEffect } from 'react';
import Step from './Step';
import { connectSteps } from './utils/connectionSteps';
import * as ModalStore from '@/lib/store/modal';

import { Button, ExternalLink, Heading, Icon, Paragraph } from '@/shared/components';

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
            <Heading $typeset='h3' fontWeight='bold' color='base' mb='24'>
                Connect Your Ledger Device
            </Heading>
            <div className='my-6 flex justify-center'>
                <Icon icon='ledger-device' className='h-[7.5rem] w-[13.75rem]' />
            </div>

            <div className='mb-6'>
                {connectSteps.map((step, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <Step step={index + 1} />
                        <Paragraph
                            fontWeight='regular'
                            $typeset='headline'
                            color='base'
                            mb={index !== connectSteps.length - 1 ? '12' : '0'}
                        >
                            {step}
                        </Paragraph>
                    </div>
                ))}
            </div>
            <div className='pb-4'>
                <Button variant='primary' onClick={handleListenDevice}>
                    Continue
                </Button>
            </div>
            <ExternalLink
                alignItems='center'
                justifyContent='center'
                display='flex'
                width='100%'
                gridGap='12px'
                href={`mailto:${constants.SUPPORT_EMAIL}?subject=ARK%20Connect%20Support%20Ledger`}
                color='primary'
            >
                <Paragraph $typeset='headline' fontWeight='medium'>
                    Support Email
                </Paragraph>
                <Icon icon='link-external' className='h-5 w-5' />
            </ExternalLink>
        </div>
    );
};
