import { ChangeEvent, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Checkbox, ExternalLink, Heading, PasswordInput } from '@/shared/components';
import constants from '@/constants';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { EnvironmentData } from '@/lib/background/contracts';

type Props = {
    formik: ReturnType<typeof useFormik>;
};

type InputValidation = 'primary' | 'destructive' | 'errorFree';

type PasswordValidation = {
    password: InputValidation;
    passwordConfirm: InputValidation;
};

const SetupPassword = ({ formik }: Props) => {
    const { env } = useEnvironmentContext();
    const { values } = formik;

    const [validation, setValidation] = useState<PasswordValidation>({
        password: 'primary',
        passwordConfirm: 'primary',
    });

    const isValid = Object.values(validation).every((status) => status === 'errorFree');

    useEffect(() => {
        validatePassword();
    }, [values.password, values.passwordConfirm]);

    const handleTermsAndConditionsChange = (evt: ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('termsAndConditionsConfirmed', evt.target.checked);
    };

    const handlePasswordChange = (evt: ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('password', evt.target.value);
    };

    const handlePasswordConfirmChange = (evt: ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('passwordConfirm', evt.target.value);
    };

    const validatePassword = () => {
        const { password, passwordConfirm } = values;
        if (!password) return;

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            setValidation({ ...validation, password: 'destructive' });
        } else {
            if (!passwordConfirm) {
                setValidation({ ...validation, password: 'errorFree' });
            } else if (password === passwordConfirm) {
                setValidation({ password: 'errorFree', passwordConfirm: 'errorFree' });
            } else {
                setValidation({ password: 'errorFree', passwordConfirm: 'destructive' });
            }
        }
    };

    const submitForm = async () => {
        env.data().set(EnvironmentData.HasOnboarded, true);
        await env.persist();

        formik.submitForm();
    };

    return (
        <div className='flex min-h-[450px] flex-col'>
            <Heading level={3} className='mb-2'>
                Setup a Password
            </Heading>
            <p className='typeset-headline mb-4'>
                Create a password to access your wallet each time you use ARK Connect.
            </p>
            <div className='flex h-full flex-col justify-between'>
                <div className='flex flex-col gap-4'>
                    <PasswordInput
                        name='password'
                        variant={validation.password}
                        labelText='Password'
                        onChange={handlePasswordChange}
                        value={values.password ?? ''}
                        helperText={
                            validation.password !== 'errorFree'
                                ? 'Requires at least 8 characters and one number'
                                : ''
                        }
                    />
                    <PasswordInput
                        name='passwordConfirm'
                        value={values.passwordConfirm ?? ''}
                        variant={validation.passwordConfirm}
                        labelText='Confirm Password'
                        onChange={handlePasswordConfirmChange}
                        helperText={
                            validation.passwordConfirm === 'destructive'
                                ? 'Passwords do not match.'
                                : ''
                        }
                    />
                </div>
                <div className='flex flex-col'>
                    <div className='flex'>
                        <Checkbox
                            id='termsAndConditionsConfirmed'
                            name='termsAndConditionsConfirmed'
                            checked={values.termsAndConditionsConfirmed}
                            onChange={handleTermsAndConditionsChange}
                        />
                        <div className='flex'>
                            <label
                                htmlFor='termsAndConditionsConfirmed'
                                className='typeset-body font-medium text-light-black dark:text-white'
                            >
                                I accept the{' '}
                                <ExternalLink
                                    href={constants.TERMS_OF_SERVICE}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-theme-primary-700 dark:text-theme-primary-650'
                                >
                                    Terms of Service
                                </ExternalLink>{' '}
                                and{' '}
                                <ExternalLink
                                    href={constants.PRIVACY_POLICY}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-theme-primary-700 dark:text-theme-primary-650'
                                >
                                    Privacy Policy
                                </ExternalLink>
                                .
                            </label>
                        </div>
                    </div>

                    <Button
                        className='mt-6'
                        variant='primary'
                        disabled={!values.termsAndConditionsConfirmed || !isValid}
                        onClick={submitForm}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SetupPassword;
