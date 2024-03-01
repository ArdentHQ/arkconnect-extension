import { Services } from '@ardenthq/sdk';
import { FormikProps } from 'formik';
import { useEffect, useRef, useState } from 'react';
import trimAddress from '@/lib/utils/trimAddress';
import { ImportWithLedger } from '@/pages/ImportWithLedger';
import {
    Button,
    Container,
    FlexContainer,
    Heading,
    Icon,
    Loader,
    Paragraph,
} from '@/shared/components';
import { useProfileContext } from '@/lib/context/Profile';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useMessageSigner } from '@/lib/hooks/useMessageSigner';
import { useEnvironmentContext } from '@/lib/context/Environment';
import formatCurrency from '@/lib/utils/formatCurrency';

type Props = {
    formik: FormikProps<ImportWithLedger>;
    goToNextStep: () => void;
    goToPrevStep: () => void;
};

const SignMessage = ({ formik, goToNextStep, goToPrevStep }: Props) => {
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const abortReference = useRef(new AbortController());
    const activeNetwork = useActiveNetwork();
    const { sign } = useMessageSigner();
    const [signedMessage, setSignedMessage] = useState<Services.SignedMessage | undefined>(
        undefined,
    );
    const [hasLedgerResponded, setHasLedgerResponded] = useState(false);
    const [ledgerWalletIndex, setLedgerWalletIndex] = useState<number>(0);
    const {
        values: { wallets },
    } = formik;

    const ledgerWallet = wallets[ledgerWalletIndex];

    useEffect(() => {
        (async () => {
            await submitForm();
        })();
    }, [ledgerWalletIndex]);

    const signNextWallet = () => {
        setLedgerWalletIndex(ledgerWalletIndex + 1);
        setSignedMessage(undefined);
        setHasLedgerResponded(false);
    };

    const submitForm = async () => {
        const wallet = profile
            .wallets()
            .findByAddressWithNetwork(ledgerWallet.address, activeNetwork!.id());
        if (!wallet) return;
        const abortSignal = abortReference.current.signal;

        try {
            const signedMessageResult = await sign(wallet, 'Import wallet with ARK Connect', {
                abortSignal,
            });

            setSignedMessage(signedMessageResult);
            setHasLedgerResponded(true);
        } catch (error) {
            profile.wallets().forget(wallet.id());
            setHasLedgerResponded(true);
            formik.setFieldValue(
                'importedWallets',
                formik.values.importedWallets.filter(
                    (importedWallet) => importedWallet.id() !== wallet.id(),
                ),
            );
            await env.persist();
        }
    };
    return (
        <Container>
            {wallets.length > 1 && (
                <Container
                    px='8'
                    py='4'
                    mb='16'
                    backgroundColor='ledgerWalletStep'
                    borderRadius='8'
                    display='inline-block'
                >
                    <Paragraph $typeset='headline' fontWeight='medium' color='primary'>
                        {ledgerWalletIndex + 1} of {wallets.length}
                    </Paragraph>
                </Container>
            )}
            <Heading $typeset='h3' fontWeight='bold' color='base'>
                Sign the message on your Ledger to import the address
            </Heading>
            <FlexContainer justifyContent='center' my='24'>
                <Icon width='146px' height='105px' icon='ledger-message' />
            </FlexContainer>
            {ledgerWallet && (
                <Container
                    border='1px solid'
                    borderColor={
                        signedMessage
                            ? 'primary'
                            : hasLedgerResponded
                            ? 'rejectedBorder'
                            : 'warning400'
                    }
                    borderRadius='16'
                >
                    <FlexContainer padding='14' justifyContent='space-between'>
                        <Paragraph $typeset='headline' fontWeight='regular' color='base'>
                            {trimAddress(ledgerWallet.address, 'short')}
                        </Paragraph>
                        <Paragraph $typeset='headline' fontWeight='regular' color='base'>
                            {ledgerWallet.balance !== undefined &&
                                formatCurrency(
                                    ledgerWallet.balance,
                                    activeNetwork.id() === 'ark.devnet' ? 'DARK' : 'ARK',
                                    { withTicker: true },
                                )}
                        </Paragraph>
                    </FlexContainer>
                    {signedMessage ? (
                        <FlexContainer
                            justifyContent='center'
                            alignItems='center'
                            backgroundColor='signedSignature'
                            color='primary'
                            p='8'
                            gridGap='8px'
                            borderBottomRightRadius='16'
                            borderBottomLeftRadius='16'
                        >
                            <Icon icon='check' width='20px' height='20px' />
                            <Paragraph $typeset='body' fontWeight='medium'>
                                Signed
                            </Paragraph>
                        </FlexContainer>
                    ) : hasLedgerResponded ? (
                        <FlexContainer
                            justifyContent='center'
                            alignItems='center'
                            backgroundColor='rejected'
                            color='error'
                            p='8'
                            gridGap='8px'
                            borderBottomRightRadius='16'
                            borderBottomLeftRadius='16'
                        >
                            <Icon icon='x' width='18px' height='18px' />
                            <Paragraph $typeset='body' fontWeight='medium'>
                                Request Rejected
                            </Paragraph>
                        </FlexContainer>
                    ) : (
                        <FlexContainer
                            justifyContent='center'
                            alignItems='center'
                            backgroundColor='testNetLabel'
                            color='warning500'
                            p='8'
                            gridGap='8px'
                            borderBottomRightRadius='16'
                            borderBottomLeftRadius='16'
                        >
                            <Loader variant='warning' />
                            <Paragraph $typeset='body' fontWeight='medium'>
                                Waiting for your signature
                            </Paragraph>
                        </FlexContainer>
                    )}
                </Container>
            )}
            <Paragraph my='24' $typeset='body' fontWeight='regular' color='gray'>
                Ensure that your Ledger is unlocked, connected to your computer, and the ARK app is
                running.
            </Paragraph>
            {wallets.length > ledgerWalletIndex + 1 ? (
                <Button
                    variant='primary'
                    onClick={signNextWallet}
                    disabled={!signedMessage && !hasLedgerResponded}
                >
                    Sign Next Address
                </Button>
            ) : wallets.length === 1 && hasLedgerResponded && !signedMessage ? (
                <Button variant='primary' onClick={goToPrevStep} disabled={!hasLedgerResponded}>
                    Send Request Again
                </Button>
            ) : (
                <Button variant='primary' onClick={goToNextStep} disabled={!hasLedgerResponded}>
                    Continue
                </Button>
            )}
        </Container>
    );
};

export default SignMessage;
