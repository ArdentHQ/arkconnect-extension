import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { runtime } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import * as SessionStore from '@/lib/store/session';
import * as WalletStore from '@/lib/store/wallet';

import { Button, HeadingDescription, PasswordInput, WarningIcon } from '@/shared/components';
import { useAppDispatch, useAppSelector } from '@/lib/store';

import { ExtensionEvents } from '@/lib/events';
import { isValidPassword } from '@/lib/utils/validations';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useProfileContext } from '@/lib/context/Profile';
import useResetExtension from '@/lib/hooks/useResetExtension';
import { ValidationVariant } from '@/components/wallet/create';

const Logout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { initProfile, profile } = useProfileContext();
    const [password, setPassword] = useState<string>('');
    const [validationVariant, setValidationVariant] = useState<ValidationVariant>('primary');
    const sessions = useAppSelector(SessionStore.selectSessions);
    const { onError } = useErrorHandlerContext();
    const walletsIds = useAppSelector(WalletStore.selectWalletsIds);
    const { softResetExtension } = useResetExtension();
    const { t } = useTranslation();
    const walletsToLogout = location.state;

    const walletId: string | undefined =
        walletsToLogout && walletsToLogout.length === 1 ? walletsToLogout[0] : walletsIds[0];

    const wallet =
        walletId !== undefined && profile.wallets().has(walletId)
            ? profile.wallets().findById(walletId)
            : undefined;

    const logoutWallet = async () => {
        try {
            if (!(await isValidPassword(password))) {
                setValidationVariant('destructive');
                return;
            }
            setValidationVariant('primary');
            if (!location.state) return;

            const walletsToDelete = location.state;

            location.state.forEach(async (walletId: string) => {
                Object.values(sessions).map((session) => {
                    if (session.walletId !== walletId) return;
                    ExtensionEvents({ profile }).disconnect(session.domain);

                    dispatch(SessionStore.sessionRemoved([session.id]));
                });
            });

            const { error, noWallets } = await runtime.sendMessage({
                type: 'REMOVE_WALLETS',
                data: {
                    password,
                    walletIds: walletsToDelete,
                },
            });

            if (noWallets) {
                await softResetExtension();
                await initProfile();
                return;
            }

            if (error) {
                onError(error);
                return;
            }

            await dispatch(WalletStore.walletRemoved(location.state));

            await initProfile();
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

    const handleEnterKey = async (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            await logoutWallet();
        }
    };

    const getAddressesType = () => {
        let hasLedger = false;
        let hasPassphrase = false;
        let text = '';

        walletsToLogout.some((walletId: string) => {
            const wallet = profile.wallets().findById(walletId);
            if (wallet.isLedger()) {
                hasLedger = true;
            } else {
                hasPassphrase = true;
            }

            return hasLedger && hasPassphrase;
        });

        if (hasLedger && hasPassphrase) {
            text = t('PAGES.LOGOUT.ADDRESS_TYPE.PASSPHRASE_OR_LEDGER');
        } else if (hasLedger) {
            text = t('PAGES.LOGOUT.ADDRESS_TYPE.LEDGER');
        } else {
            text = t('PAGES.LOGOUT.ADDRESS_TYPE.PASSPHRASE');
        }

        return text;
    };

    return (
        <SubPageLayout
            title={
                walletsToLogout.length > 1
                    ? t('PAGES.LOGOUT.REMOVE_ADDRESSES')
                    : t('PAGES.LOGOUT.REMOVE_ADDRESS')
            }
            hideCloseButton={false}
            footer={
                <div className='flex flex-col p-4'>
                    <Button
                        variant='destructivePrimary'
                        onClick={logoutWallet}
                        disabled={!password.length}
                        className='mb-2'
                    >
                        {walletsToLogout.length > 1
                            ? t('PAGES.LOGOUT.REMOVE_ADDRESSES')
                            : t('PAGES.LOGOUT.REMOVE_ADDRESS')}
                    </Button>
                </div>
            }
        >
            <div className='flex h-full flex-col'>
                <HeadingDescription>
                    {walletsToLogout && walletsToLogout.length > 1 ? (
                        <span className='typeset-headline'>
                            {t('PAGES.LOGOUT.ARE_YOU_SURE_YOU_WANT_TO_REMOVE_1')}
                            <span className='typeset-headline inline-block text-light-black dark:text-white'>
                                {walletsToLogout.length}{' '}
                                {t('PAGES.LOGOUT.ARE_YOU_SURE_YOU_WANT_TO_REMOVE_2')}
                            </span>{' '}
                            {`${t('PAGES.LOGOUT.YOU_WONT_BE_ABLE_TO_LOGIN_AGAIN')} ${getAddressesType()}.`}
                        </span>
                    ) : wallet?.isLedger() ? (
                        t('PAGES.LOGOUT.YOU_WONT_BE_ABLE_TO_LOGIN_AGAIN_WITHOUT_LEDGER')
                    ) : (
                        t('PAGES.LOGOUT.YOU_WONT_BE_ABLE_TO_LOGIN_AGAIN_WITHOUT_PASSPHRASE')
                    )}
                </HeadingDescription>

                <div className='mt-4 flex items-center justify-center'>
                    <WarningIcon iconClassName='w-[146px] h-[135px]' />
                </div>

                <div className='flex flex-1 flex-col justify-between'>
                    <div className='mt-[18px] flex flex-col gap-1.5'>
                        <p className='typeset-headline font-medium text-subtle-black dark:text-theme-secondary-200'>
                            {t('PAGES.LOGOUT.ENTER_PASSWORD')}
                        </p>
                        <PasswordInput
                            name='password'
                            variant={validationVariant}
                            onChange={handlePasswordChange}
                            onKeyDown={handleEnterKey}
                            value={password}
                            helperText={
                                validationVariant === 'destructive'
                                    ? t('MISC.INCORRECT_PASSWORD')
                                    : ''
                            }
                        />
                    </div>
                </div>
            </div>
        </SubPageLayout>
    );
};

export default Logout;
