import * as Yup from 'yup';

import { runtime } from 'webextension-polyfill';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import SubPageLayout from '../SubPageLayout';
import { Button, Paragraph, PasswordInput } from '@/shared/components';

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
            <div className='flex h-full flex-1 flex-col justify-between'>
                <Paragraph
                    $typeset='headline'
                    fontWeight='regular'
                    className='text-theme-secondary-500 dark:text-theme-secondary-300'
                    mb='24'
                >
                    Change password for your wallet. Your password is only stored locally.
                </Paragraph>
                <div className='h-full'>
                    <div className='mb-4 border-b border-solid border-b-theme-secondary-200 pb-4 dark:border-b-theme-secondary-600'>
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
                    </div>

                    <div className='flex flex-col gap-4'>
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
                    </div>
                </div>
                <Button
                    variant='primary'
                    disabled={!formik.isValid || !formik.values.oldPassword.length}
                    onClick={formik.submitForm}
                    className='mt-auto'
                >
                    Save New Password
                </Button>
            </div>
        </SubPageLayout>
    );
};

export default ChangeLocalPassword;
