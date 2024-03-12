import { FormikProps } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import { ImportedWalletFormik } from '.';
import { Button, Heading, Input } from '@/shared/components';

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
            <Heading className='mb-2' level={3}>
                Address Imported Successfully!
            </Heading>
            <p className='typeset-headline mb-6 text-theme-secondary-500 dark:text-theme-secondary-300'>
                Your address details are shown below.
            </p>
            <div>
                <div className=' mb-4 border-b border-solid border-b-theme-secondary-200 pb-4 dark:border-b-theme-secondary-600'>
                    <p className='typeset-body mb-2 font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                        Address
                    </p>
                    <p className='typeset-headline text-light-black dark:text-white'>
                        {formik.values.wallet?.address()}
                    </p>
                </div>

                <div className=' mb-4 border-b border-solid border-b-theme-secondary-200 pb-4 dark:border-b-theme-secondary-600'>
                    <p className='typeset-body mb-2 font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                        Balance
                    </p>
                    <p className='typeset-headline text-light-black dark:text-white'>
                        {formik.values.wallet?.balance()?.toLocaleString()}{' '}
                        {formik.values.wallet?.currency()}
                    </p>
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
            </div>
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
