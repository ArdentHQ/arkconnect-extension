import { useNavigate } from 'react-router-dom';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Icon, InternalLink, Layout, LockIcon, PasswordInput } from '@/shared/components';
import { ValidationVariant } from '@/components/wallet/create';
import { useProfileContext } from '@/lib/context/Profile';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useAppDispatch } from '@/lib/store';
import * as UIStore from '@/lib/store/ui';

const EnterPassword = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { initProfile } = useProfileContext();
    const { onError } = useErrorHandlerContext();
    const [password, setPassword] = useState<string>('');
    const [validationVariant, setValidationVariant] = useState<ValidationVariant>('primary');
    const { t } = useTranslation();

    const unlockExtension = async () => {
        try {
            const status = await runtime.sendMessage({
                type: 'UNLOCK',
                data: { password },
            });

            if (status.isLocked) {
                setValidationVariant('destructive');
                return;
            }

            await initProfile();

            setValidationVariant('primary');

            dispatch(UIStore.lockedChanged(false));

            navigate('/');
        } catch (error) {
            onError(error);
        }
    };

    const handlePasswordChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setPassword(evt.target.value);
        if (validationVariant !== 'destructive') return;
        setValidationVariant('primary');
    };

    const handleEnterKey = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            unlockExtension();
        }
    };

    return (
        <Layout>
            <div className='h-[550px] px-4'>
                <div className='flex items-center justify-center py-[59px]'>
                    <LockIcon />
                </div>

                <div>
                    <div
                        className={cn('flex flex-col gap-1.5', {
                            'mb-5': validationVariant === 'destructive',
                            'mb-11': validationVariant !== 'destructive',
                        })}
                    >
                        <p className='typeset-headline font-medium text-subtle-black dark:text-theme-secondary-200'>
                            {t('PAGES.ENTER_PASSWORD.ENTER_PASSWORD_TO_UNLOCK')}
                        </p>
                        <PasswordInput
                            name='password'
                            variant={validationVariant}
                            onChange={handlePasswordChange}
                            placeholder={t('PAGES.ENTER_PASSWORD.YOUR_PASSWORD')}
                            onKeyDown={handleEnterKey}
                            value={password}
                            helperText={
                                validationVariant === 'destructive'
                                    ? t('MISC.INCORRECT_PASSWORD')
                                    : ''
                            }
                        />
                    </div>
                    <Button
                        variant='primary'
                        onClick={unlockExtension}
                        disabled={!password.length || validationVariant === 'destructive'}
                        className='mb-6'
                    >
                        {t('PAGES.ENTER_PASSWORD.UNLOCK_EXTENSION')}

                        <span
                            className={cn(
                                'unlock-button absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2',
                                {
                                    disabled:
                                        !password.length || validationVariant === 'destructive',
                                },
                            )}
                        >
                            <Icon icon='corner-down-left' className='h-5 w-5' />
                        </span>
                    </Button>
                    <InternalLink
                        to='/forgot-password'
                        className='flex w-full items-center justify-center text-light-black dark:text-white'
                    >
                        <span className='typeset-headline font-medium text-light-black dark:text-white'>
                            {t('PAGES.ENTER_PASSWORD.FORGOT_PASSWORD')}
                        </span>
                    </InternalLink>
                </div>
            </div>
        </Layout>
    );
};

export default EnterPassword;
