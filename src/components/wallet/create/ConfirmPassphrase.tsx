import { FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { CreateWalletFormik, ValidationVariant } from '.';
import { Button, Checkbox, Heading, Headline, Input } from '@/shared/components';
import getNumberSuffix from '@/lib/utils/getNumberSuffix';
import { TestnetIcon } from '@/components/wallet/address/Address.blocks';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
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
            path: ScreenName.CreateWallet,
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
            <div className='mb-2 flex items-center gap-2'>
                <Heading level={4}>Confirm Your Passphrase</Heading>
                {selectedNetwork.isTest() && <TestnetIcon />}
            </div>

            <Headline className='mb-4'>
                Confirm that you’ve saved your secret passphrase by correctly entering the word in
                the designated input field below.
            </Headline>

            <div className='flex flex-1 items-start gap-2.5'>
                {values.confirmationNumbers?.map((number: number, index: number) => (
                    <div className='flex flex-col items-start gap-1.5' key={index}>
                        <p className='typeset-headline font-medium text-light-black dark:text-white'>
                            {getNumberSuffix(number)} word
                        </p>
                        <Input
                            variant={validationStatus[index]}
                            type='text'
                            name={`confirmPassphrase[${index}]`}
                            value={values.confirmPassphrase[index]}
                            onChange={(evt) => handleConfirmPassphraseInputChange(evt, index)}
                        />
                    </div>
                ))}
            </div>

            <div className='mt-auto'>
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
                    className='mt-6'
                >
                    Confirm
                </Button>
            </div>
        </>
    );
};

export default ConfirmPassphrase;
