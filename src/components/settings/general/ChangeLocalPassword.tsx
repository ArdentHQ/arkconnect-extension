import * as Yup from 'yup';

import { runtime } from 'webextension-polyfill';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Button, HeadingDescription, PasswordInput } from '@/shared/components';

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
    const { t } = useTranslation();
    const loadingModal = useLoadingModal({
        loadingMessage: t('PAGES.SETTINGS.FEEDBACK.UPDATING_YOUR_PASWORD'),
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
                    formikHelpers.setFieldError(
                        'oldPassword',
                        t('PAGES.SETTINGS.FEEDBACK.INCORRECT_PASWORD'),
                    );
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
                    formikHelpers.setFieldError(
                        'oldPassword',
                        t('PAGES.SETTINGS.FEEDBACK.INCORRECT_PASWORD'),
                    );
                    return;
                }

                await initProfile();

                toast(
                    'success',
                    t('PAGES.SETTINGS.FEEDBACK.PASSWORD_CHANGED_SUCCESSFULLY'),
                    ToastPosition.HIGH,
                );
                navigate('/');

                loadingModal.close();
            } catch (error) {
                toast('danger', t('MISC.SOMETHING_WENT_WRONG'), ToastPosition.HIGH);
                onError(error);
            }
        },
    });

    return (
        <SubPageLayout title={t('PAGES.SETTINGS.CHANGE_LOCAL_PASSWORD')} footer={
            <div className='p-4'>
                <Button
                    variant='primary'
                    disabled={!formik.isValid || !formik.values.oldPassword.length}
                    onClick={formik.submitForm}
                    className='mt-auto'
                >
                    {t('PAGES.SETTINGS.FORM.SAVE_NEW_PASSWORD')}
                </Button>
            </div>
        }>
            <div className='flex h-full flex-1 flex-col justify-between'>
                <HeadingDescription className='mb-6'>
                    {t('PAGES.SETTINGS.CHANGE_PASSWORD_FOR_YOUR_WALLET')}
                </HeadingDescription>

                <div className='h-full'>
                    <div className='mb-4 border-b border-solid border-b-theme-secondary-200 pb-4 dark:border-b-theme-secondary-600'>
                        <PasswordInput
                            name='oldPassword'
                            variant={formik.errors.oldPassword ? 'destructive' : 'primary'}
                            labelText={t('PAGES.SETTINGS.FORM.OLD_PASSWORD')}
                            helperText={formik.errors.oldPassword}
                            placeholder={t('PAGES.SETTINGS.FORM.ENTER_OLD_PASSWORD')}
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
                            labelText={t('PAGES.SETTINGS.FORM.NEW_PASSWORD')}
                            placeholder={t('PAGES.SETTINGS.FORM.ENTER_NEW_PASSWORD')}
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
                            labelText={t('PAGES.SETTINGS.FORM.CONFIRM_NEW_PASSWORD')}
                            placeholder={t('PAGES.SETTINGS.FORM.ENTER_NEW_PASSWORD_AGAIN')}
                            helperText={formik.errors.confirmNewPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmNewPassword}
                        />
                    </div>
                </div>
            </div>
        </SubPageLayout>
    );
};

export default ChangeLocalPassword;
