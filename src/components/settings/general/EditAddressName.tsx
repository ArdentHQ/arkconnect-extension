import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { object, string } from 'yup';
import SubPageLayout from '../SubPageLayout';
import { Paragraph, FlexContainer, Input, Button, Container } from '@/shared/components';
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
            <FlexContainer height='100%' flexDirection='column'>
                <Paragraph $typeset='headline' color='gray' mb='24'>
                    Name your address so you can identify it later. This name is only stored
                    locally.
                </Paragraph>

                <Container
                    mb={formik.isValid || !formik.values.addressName?.length ? '270' : '246'}
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
                </Container>
                <Button
                    variant='primary'
                    onClick={formik.submitForm}
                    disabled={!formik.isValid || !formik.values.addressName?.length}
                >
                    Save
                </Button>
            </FlexContainer>
        </SubPageLayout>
    );
};

export default EditAddressName;
