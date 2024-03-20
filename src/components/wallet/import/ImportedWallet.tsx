import { FormikProps } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import { ImportedWalletFormik } from '.';
import { Button, Heading, HeadingDescription, Input } from '@/shared/components';

type Props = {
    goToNextStep: () => void;
    formik: FormikProps<ImportedWalletFormik>;
};

const ImportedWallet = ({ goToNextStep, formik }: Props) => {
    const [isAddressValid, setIsAddressValid] = useState<boolean>(true);
    const { t } = useTranslation();

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
                {t('PAGES.IMPORT_NEW_WALLET.ADDRESS_IMPORTED')}
            </Heading>
            <HeadingDescription className='mb-6'>
                {t('PAGES.IMPORT_NEW_WALLET.ADDRESS_DETAILS_ARE_SHOWN_BELOW')}
            </HeadingDescription>
            <div>
                <div className=' mb-4 border-b border-solid border-b-theme-secondary-200 pb-4 dark:border-b-theme-secondary-600'>
                    <p className='typeset-body mb-2 font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {t('COMMON.ADDRESS')}
                    </p>
                    <p className='typeset-headline text-light-black dark:text-white'>
                        {formik.values.wallet?.address()}
                    </p>
                </div>

                <div className=' mb-4 border-b border-solid border-b-theme-secondary-200 pb-4 dark:border-b-theme-secondary-600'>
                    <p className='typeset-body mb-2 font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {t('COMMON.BALANCE')}
                    </p>
                    <p className='typeset-headline text-light-black dark:text-white'>
                        {formik.values.wallet?.balance()?.toLocaleString()}{' '}
                        {formik.values.wallet?.currency()}
                    </p>
                </div>

                <div>
                    <Input
                        variant={isAddressValid ? 'primary' : 'destructive'}
                        labelText={t('PAGES.IMPORT_NEW_WALLET.ADDRESS_NAME')}
                        helperText={
                            isAddressValid
                                ? t('PAGES.IMPORT_NEW_WALLET.NAME_YOUR_ADDRESS')
                                : t('PAGES.IMPORT_NEW_WALLET.MAXIMUM_CHARACTERS')
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
                {t('ACTION.CONTINUE')}
            </Button>
        </>
    );
};

export default ImportedWallet;
