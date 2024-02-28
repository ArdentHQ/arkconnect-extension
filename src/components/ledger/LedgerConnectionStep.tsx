import { useEffect } from 'react';
import Step from './Step';
import { connectSteps } from './utils/connectionSteps';
import constants from '@/constants';
import {
    Button,
    Container,
    ExternalLink,
    FlexContainer,
    Heading,
    Icon,
    Paragraph,
} from '@/shared/components';
import { useProfileContext } from '@/lib/context/Profile';
import { useLedgerContext } from '@/lib/Ledger';
import useNetwork from '@/lib/hooks/useNetwork';
import { useAppDispatch } from '@/lib/store';
import * as ModalStore from '@/lib/store/modal';

import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';

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
    const { activeNetwork: network } = useNetwork();
    const dispatch = useAppDispatch();

    const { connect, abortConnectionRetry, error, isConnected, accessDenied } = useLedgerContext();

    const {
        listenDevice,
        hasDeviceAvailable,
        error: ledgerError,
        resetConnectionState,
    } = useLedgerContext();

    const handleListenDevice = () => {
        const loadingModal: ModalStore.LoadingModalType = {
            isOpen: true,
            isLoading: true,
            completedMessage: 'Ledger Connected!',
            loadingMessage: 'Waiting for you to choose and connect a Ledger device.',
            CTA: ModalStore.CTAType.INITIATE_LEDGER,
        };
        dispatch(ModalStore.loadingModalUpdated(loadingModal));
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
        <Container>
            <Heading $typeset='h3' fontWeight='bold' color='base' mb='24'>
                Connect Your Ledger Device
            </Heading>
            <FlexContainer my='24' justifyContent='center'>
                <Icon icon='ledger-device' width='220px' height='120px' />
            </FlexContainer>
            <Container mb='24'>
                {connectSteps.map((step, index) => (
                    <FlexContainer key={index} alignItems='flex-start' gridGap='8px'>
                        <Step step={index + 1} />
                        <Paragraph
                            fontWeight='regular'
                            $typeset='headline'
                            color='base'
                            mb={index !== connectSteps.length - 1 ? '12' : '0'}
                        >
                            {step}
                        </Paragraph>
                    </FlexContainer>
                ))}
            </Container>
            <Button variant='primary' mb='16' onClick={handleListenDevice}>
                Continue
            </Button>
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
                <Icon icon='link-external' width='20px' height='20px' />
            </ExternalLink>
        </Container>
    );
};
