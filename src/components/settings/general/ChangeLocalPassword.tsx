import * as Yup from 'yup';

import { runtime } from 'webextension-polyfill';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import SubPageLayout from '../SubPageLayout';
import { Button, Container, FlexContainer, Paragraph, PasswordInput } from '@/shared/components';

import { ToastPosition } from '@/components/toast/ToastContainer';
import { isValidPassword } from '@/lib/utils/validations';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useProfileContext } from '@/lib/context/Profile';
import useToast from '@/lib/hooks/useToast';
import useLoadingModal from '@/lib/hooks/useLoadingModal';

type ChangePasswordFormik = {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(''),
    newPassword: Yup.string()
        .min(8, 'Requires at least eight characters and one number')
        .matches(/(?=.*\d)/, 'Requires at least eight characters and one number')
        .required(''),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), ''], 'Passwords do not match')
        .required(''),
});

const ChangeLocalPassword = () => {
    const { onError } = useErrorHandlerContext();
    const navigate = useNavigate();
    const toast = useToast();
    const { initProfile } = useProfileContext();
    const loadingModal = useLoadingModal({
        loadingMessage: 'Updating your password...',
    });
    const formik = useFormik<ChangePasswordFormik>({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        validationSchema,
        onSubmit: async (values, formikHelpers) => {
            try {
                if (!(await isValidPassword(values.oldPassword))) {
                    formikHelpers.setFieldError('oldPassword', 'Incorrect password');
                    return;
                }

                loadingModal.setLoading();

                const { error } = await runtime.sendMessage({
                    type: 'CHANGE_PASSWORD',
                    data: {
                        newPassword: formik.values.newPassword,
                        oldPassword: formik.values.oldPassword,
                    },
                });

                if (error) {
                    formikHelpers.setFieldError('oldPassword', 'Incorrect password');
                    return;
                }

                await initProfile();

                toast('success', 'Password changed successfully', ToastPosition.HIGH);
                navigate('/');

                loadingModal.close();
            } catch (error) {
                toast('danger', 'Something went wrong!', ToastPosition.HIGH);
                onError(error);
            }
        },
    });

    return (
        <SubPageLayout title='Change Local Password'>
            <FlexContainer
                flexDirection='column'
                flex={1}
                justifyContent={'space-between'}
                height={'100%'}
            >
                <Paragraph $typeset='headline' fontWeight='regular' color='gray' mb='24'>
                    Change password for your wallet. Your password is only stored locally.
                </Paragraph>
                <Container height='100%'>
                    <Container
                        pb='16'
                        mb='16'
                        borderBottom='1px solid'
                        borderColor='toggleInactive'
                    >
                        <PasswordInput
                            name='oldPassword'
                            variant={formik.errors.oldPassword ? 'destructive' : 'primary'}
                            labelText='Old Password'
                            helperText={formik.errors.oldPassword}
                            placeholder='Enter old password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.oldPassword}
                        />
                    </Container>

                    <FlexContainer flexDirection='column' gridGap='16px'>
                        <PasswordInput
                            name='newPassword'
                            variant={
                                formik.values.newPassword
                                    ? formik.errors.newPassword
                                        ? 'destructive'
                                        : 'errorFree'
                                    : 'primary'
                            }
                            labelText='New Password'
                            placeholder='Enter new password'
                            helperText={formik.errors.newPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.newPassword}
                        />
                        <PasswordInput
                            name='confirmNewPassword'
                            variant={
                                formik.values.confirmNewPassword
                                    ? formik.errors.confirmNewPassword
                                        ? 'destructive'
                                        : 'errorFree'
                                    : 'primary'
                            }
                            labelText='Confirm New Password'
                            placeholder='Enter new password again'
                            helperText={formik.errors.confirmNewPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmNewPassword}
                        />
                    </FlexContainer>
                </Container>
                <Button
                    variant='primary'
                    disabled={!formik.isValid || !formik.values.oldPassword.length}
                    onClick={formik.submitForm}
                    className='mt-auto'
                >
                    Save New Password
                </Button>
            </FlexContainer>
        </SubPageLayout>
    );
};

export default ChangeLocalPassword;
