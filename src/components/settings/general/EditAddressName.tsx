import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { object, string } from 'yup';
import classNames from 'classnames';
import SubPageLayout from '../SubPageLayout';
import { Button, Input, Paragraph } from '@/shared/components';
import useToast from '@/lib/hooks/useToast';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';

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
                toast('danger', 'Something went wrong!');
                return;
            }

            wallet.mutator().alias(formik.values.addressName);
            await persist();
            toast('success', 'Address name updated');
            navigate(-1);
        },
    });

    const handleAddressNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const addressName = evt.target.value.trim() === '' ? '' : evt.target.value;

        formik.setFieldValue('addressName', addressName);
    };

    return (
        <SubPageLayout title='Edit Address Name' hideCloseButton={false}>
            <div className='flex h-full flex-col'>
                <Paragraph
                    className='typeset-headline text-theme-secondary-500 dark:text-theme-secondary-300'
                    mb='24'
                >
                    Name your address so you can identify it later. This name is only stored
                    locally.
                </Paragraph>

                <div
                    className={classNames({
                        'mb-[270px]': formik.isValid || !formik.values.addressName?.length,
                        'mb-[246px]': !formik.isValid && formik.values.addressName?.length,
                    })}
                >
                    <Input
                        variant={formik.errors.addressName ? 'destructive' : 'primary'}
                        type='text'
                        name='addressName'
                        placeholder='Enter name...'
                        value={formik.values.addressName}
                        onChange={handleAddressNameChange}
                        onBlur={formik.handleBlur}
                        labelText='Address Name'
                        helperText={formik.errors.addressName}
                    />
                </div>
                <Button
                    variant='primary'
                    onClick={formik.submitForm}
                    disabled={!formik.isValid || !formik.values.addressName?.length}
                >
                    Save
                </Button>
            </div>
        </SubPageLayout>
    );
};

export default EditAddressName;
