import { FormikProps } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import { ImportedWalletFormik } from '.';
import { Button, Container, Heading, Input, Paragraph } from '@/shared/components';

type Props = {
    goToNextStep: () => void;
    formik: FormikProps<ImportedWalletFormik>;
};

const ImportedWallet = ({ goToNextStep, formik }: Props) => {
    const [isAddressValid, setIsAddressValid] = useState<boolean>(true);

    useEffect(() => {
        if (
            formik.values.addressName.trim().length > 20 ||
            formik.values.addressName.trim().length === 0
        ) {
            setIsAddressValid(false);
        } else {
            setIsAddressValid(true);
        }
    }, [formik.values.addressName]);

    const handleNextStep = () => {
        if (formik.values.addressName && isAddressValid) {
            formik.values.wallet
                ?.settings()
                .set(Contracts.WalletSetting.Alias, formik.values.addressName);
            goToNextStep();
        }
    };

    const handleAddressNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const addressName = evt.target.value.trim() === '' ? '' : evt.target.value;
        formik.setFieldValue('addressName', addressName);
    };

    return (
        <>
            <Heading $typeset='h3' fontWeight='bold' color='base' mb='8'>
                Address Imported Successfully!
            </Heading>
            <Paragraph $typeset='headline' color='gray' mb='24'>
                Your address details are shown below.
            </Paragraph>
            <Container>
                <div className=' mb-4 border-b border-solid border-b-theme-secondary-200 pb-4 dark:border-b-theme-secondary-600'>
                    <Paragraph $typeset='body' fontWeight='medium' mb='8' color='gray'>
                        Address
                    </Paragraph>
                    <Paragraph $typeset='headline' color='base'>
                        {formik.values.wallet?.address()}
                    </Paragraph>
                </div>

                <div className=' mb-4 border-b border-solid border-b-theme-secondary-200 pb-4 dark:border-b-theme-secondary-600'>
                    <Paragraph $typeset='body' fontWeight='medium' mb='8' color='gray'>
                        Balance
                    </Paragraph>
                    <Paragraph $typeset='headline' color='base'>
                        {formik.values.wallet?.balance()?.toLocaleString()}{' '}
                        {formik.values.wallet?.currency()}
                    </Paragraph>
                </div>

                <div>
                    <Input
                        variant={isAddressValid ? 'primary' : 'destructive'}
                        labelText='Address Name'
                        helperText={
                            isAddressValid
                                ? 'Name your address so you can identify it later.'
                                : '20 characters maximum'
                        }
                        name='addressName'
                        value={formik.values.addressName}
                        onChange={handleAddressNameChange}
                    />
                </div>
            </Container>
            <Button
                variant='primary'
                disabled={!isAddressValid}
                onClick={handleNextStep}
                className='mt-auto'
            >
                Continue
            </Button>
        </>
    );
};

export default ImportedWallet;
