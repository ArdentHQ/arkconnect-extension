import { FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { CreateWalletFormik, ValidationVariant } from '.';
import {
    Button,
    Checkbox,
    Container,
    FlexContainer,
    Heading,
    Input,
    Paragraph,
} from '@/shared/components';
import getNumberSuffix from '@/lib/utils/getNumberSuffix';
import { TestnetIcon } from '@/components/wallet/address/Address.blocks';
import { getLocalValues } from '@/lib/utils/localStorage';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useAppSelector } from '@/lib/store';
import { selectTestnetEnabled } from '@/lib/store/ui';
import { ScreenName } from '@/lib/background/contracts';

type Props = {
    goToNextStep: () => void;
    formik: FormikProps<CreateWalletFormik>;
};

const ConfirmPassphrase = ({ goToNextStep, formik }: Props) => {
    const { values } = formik;
    const [validationStatus, setValidationStatus] = useState<ValidationVariant[]>([]);

    const selectedNetwork = useActiveNetwork();

    useEffect(() => {
        checkConfirmation();
    }, [values]);

    const handleNextStep = () => {
        formik.setFieldValue('passphraseValidationStatus', validationStatus);
        goToNextStep();
    };

    const checkConfirmation = () => {
        const validationStatus = values.confirmationNumbers.map((number: number, index: number) => {
            if (values.confirmPassphrase[index] === '') {
                return 'primary';
            } else if (values.passphrase[number - 1] === values.confirmPassphrase[index]) {
                return 'errorFree';
            } else {
                return 'destructive';
            }
        });
        setValidationStatus(validationStatus);
    };

    const handleLostPasswordAwarenessChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('lostPasswordAwareness', evt.target.checked);
    };

    const handleConfirmPassphraseInputChange = (
        evt: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const confirmPassphrase = values.confirmPassphrase;
        confirmPassphrase[index] = evt.target.value;

        formik.setFieldValue('confirmPassphrase', confirmPassphrase);

        runtime.sendMessage({
            type: 'SET_LAST_SCREEN',
            screenName: ScreenName.CreateWallet,
            data: {
                step: 1,
                mnemonic: values.passphrase.join(' '),
                network: values.wallet?.networkId(),
                coin: values.wallet?.network().coin(),
                confirmationNumbers: values.confirmationNumbers,
                confirmPassphrase,
            },
        });
        checkConfirmation();
    };

    return (
        <>
            <FlexContainer mb='8' alignItems='center' gridGap='8'>
                <Heading $typeset='h4' fontWeight='medium' color='base'>
                    Confirm Your Passphrase
                </Heading>
                {selectedNetwork.isTest() && <TestnetIcon />}
            </FlexContainer>

            <Paragraph $typeset='headline' color='gray' mb='16'>
                Confirm that you’ve saved your secret passphrase by correctly entering the word in
                the designated input field below.
            </Paragraph>

            <FlexContainer gridGap='10px' alignItems='top' flex={1}>
                {values.confirmationNumbers?.map((number: number, index: number) => (
                    <FlexContainer
                        key={index}
                        gridGap='6px'
                        alignItems='flex-start'
                        flexDirection='column'
                    >
                        <Paragraph $typeset='headline' fontWeight='medium' color='base'>
                            {getNumberSuffix(number)} word
                        </Paragraph>
                        <Input
                            variant={validationStatus[index]}
                            type='text'
                            name={`confirmPassphrase[${index}]`}
                            value={values.confirmPassphrase[index]}
                            onChange={(evt) => handleConfirmPassphraseInputChange(evt, index)}
                        />
                    </FlexContainer>
                ))}
            </FlexContainer>

            <Container mt='auto'>
                <Checkbox
                    id='test-1'
                    name='lostPasswordAwareness'
                    checked={values.lostPasswordAwareness}
                    onChange={handleLostPasswordAwarenessChange}
                    title='I am aware that if I lose my passphrase, I will lose access to my funds.'
                />
                <Button
                    variant='primary'
                    disabled={
                        !values.lostPasswordAwareness ||
                        !validationStatus.every((status) => status === 'errorFree')
                    }
                    onClick={handleNextStep}
                    mt='24'
                >
                    Confirm
                </Button>
            </Container>
        </>
    );
};

export default ConfirmPassphrase;
