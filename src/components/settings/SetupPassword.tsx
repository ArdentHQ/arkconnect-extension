import { ChangeEvent, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { persistScreenChanged } from '../wallet/form-persist/helpers';
import { WalletFormScreen } from '../wallet/form-persist';
import {
    Button,
    Checkbox,
    ExternalLink,
    Heading,
    Paragraph,
    PasswordInput,
} from '@/shared/components';
import { getLocalValues, setLocalValue } from '@/lib/utils/localStorage';

import constants from '@/constants';

type Props = {
    formik: ReturnType<typeof useFormik>;
};

type InputValidation = 'primary' | 'destructive' | 'errorFree';

type PasswordValidation = {
    password: InputValidation;
    passwordConfirm: InputValidation;
};

const SetupPassword = ({ formik }: Props) => {
    const { values } = formik;

    const [validation, setValidation] = useState<PasswordValidation>({
        password: 'primary',
        passwordConfirm: 'primary',
    });

    const isValid = Object.values(validation).every((status) => status === 'errorFree');

    useEffect(() => {
        validatePassword();
    }, [values.password, values.passwordConfirm]);

    useEffect(() => {
        const locationHref = window.location.href;

        if (locationHref.includes('import_with_ledger')) return;

        (async () => {
            const { hasOnboarded } = await getLocalValues();

            if (hasOnboarded) {
                persistScreenChanged({
                    screen: WalletFormScreen.OVERVIEW,
                    step: 0,
                });
            }
        })();
    }, []);

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
        await setLocalValue('hasOnboarded', true);

        formik.submitForm();
    };

    return (
        <div className='flex h-full flex-col'>
            <Heading $typeset='h3' fontWeight='bold' color='base' mb='8'>
                Setup a Password
            </Heading>
            <Paragraph $typeset='headline' color='gray' mb='16'>
                Create a password to access your wallet each time you use ARK Connect.
            </Paragraph>
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
            <div className='mt-auto flex'>
                <Checkbox
                    id='termsAndConditionsConfirmed'
                    name='termsAndConditionsConfirmed'
                    checked={values.termsAndConditionsConfirmed}
                    onChange={handleTermsAndConditionsChange}
                />
                <div className='flex'>
                    <Paragraph
                        as='label'
                        htmlFor='termsAndConditionsConfirmed'
                        $typeset='body'
                        color='base'
                        fontWeight='medium'
                    >
                        I accept the{' '}
                        <ExternalLink
                            href={constants.TERMS_OF_SERVICE}
                            target='_blank'
                            rel='noopener noreferrer'
                            color='primary'
                        >
                            Terms of Service
                        </ExternalLink>{' '}
                        and{' '}
                        <ExternalLink
                            href={constants.PRIVACY_POLICY}
                            target='_blank'
                            rel='noopener noreferrer'
                            color='primary'
                        >
                            Privacy Policy
                        </ExternalLink>
                        .
                    </Paragraph>
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
    );
};

export default SetupPassword;
