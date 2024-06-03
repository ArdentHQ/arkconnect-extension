import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Button, HeadingDescription, Input } from '@/shared/components';
import useToast from '@/lib/hooks/useToast';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';
import { Footer } from '@/shared/components/layout/Footer';

type EditAddressNameFormik = {
    addressName?: string;
};

const validationSchema = object().shape({
    addressName: string().required('').trim().max(20, '20 characters maximum'),
});

const EditAddressName = () => {
    const { walletId } = useParams();
    const navigate = useNavigate();
    const { persist } = useEnvironmentContext();
    const { profile } = useProfileContext();
    const { t } = useTranslation();

    const toast = useToast();

    if (!walletId) return <></>;

    const wallet = profile.wallets().findById(walletId);

    const formik = useFormik<EditAddressNameFormik>({
        initialValues: {
            addressName: wallet.alias() ? wallet.alias() : '',
        },
        validationSchema,
        onSubmit: async () => {
            if (!wallet || !formik.values.addressName) {
                toast('danger', t('MISC.SOMETHING_WENT_WRONG'));
                return;
            }

            wallet.mutator().alias(formik.values.addressName);
            await persist();
            toast('success', t('PAGES.SETTINGS.FEEDBACK.ADDRESS_NAME_UPDATED'));
            navigate(-1);
        },
    });

    const handleAddressNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const addressName = evt.target.value.trim() === '' ? '' : evt.target.value;

        formik.setFieldValue('addressName', addressName);
    };

    return (
        <SubPageLayout
            title={t('PAGES.SETTINGS.EDIT_ADDRESS_NAME')}
            hideCloseButton={false}
            footer={
                <Footer variant='simple'>
                    <Button
                        variant='primary'
                        onClick={formik.submitForm}
                        disabled={!formik.isValid || !formik.values.addressName?.length}
                    >
                        {t('ACTION.SAVE')}
                    </Button>
                </Footer>
            }
        >
            <div className='flex flex-col'>
                <HeadingDescription className='mb-6'>
                    {t('PAGES.SETTINGS.NAME_YOUR_ADDRESS_SO_YOU_CAN_IDENTIFY')}
                </HeadingDescription>

                <div>
                    <Input
                        variant={formik.errors.addressName ? 'destructive' : 'primary'}
                        type='text'
                        name='addressName'
                        placeholder={t('PAGES.SETTINGS.FORM.ENTER_NAME')}
                        value={formik.values.addressName}
                        onChange={handleAddressNameChange}
                        onBlur={formik.handleBlur}
                        labelText={t('PAGES.SETTINGS.FORM.ADDRESS_NAME')}
                        helperText={formik.errors.addressName}
                    />
                </div>
            </div>
        </SubPageLayout>
    );
};

export default EditAddressName;
