import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { runtime } from 'webextension-polyfill';
import { Button, PasswordInput, WarningIcon } from '@/shared/components';
import { ValidationVariant } from '@/components/wallet/create';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import * as WalletStore from '@/lib/store/wallet';
import * as SessionStore from '@/lib/store/session';
import { useProfileContext } from '@/lib/context/Profile';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { isValidPassword } from '@/lib/utils/validations';
import { ExtensionEvents } from '@/lib/events';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useResetExtension from '@/lib/hooks/useResetExtension';

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
    const resetExtension = useResetExtension();

    const walletsToLogout = location.state;

    const walletId: string | undefined =
        walletsToLogout && walletsToLogout.length === 1 ? walletsToLogout[0] : walletsIds[0];

    const wallet = walletId !== undefined ? profile.wallets().findById(walletId) : undefined;

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
                await resetExtension();
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
            text = 'a passphrase or a Ledger device';
        } else if (hasLedger) {
            text = 'a Ledger device';
        } else {
            text = 'a passphrase';
        }

        return text;
    };

    return (
        <SubPageLayout
            title={`Remove Address${walletsToLogout.length > 1 ? 'es' : ''}`}
            hideCloseButton={false}
            noPaddingBottom
        >
            <div className='flex h-full flex-col'>
                <p className='typeset-headline text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {walletsToLogout && walletsToLogout.length > 1 ? (
                        <span className='typeset-headline'>
                            Are you sure you want to remove{' '}
                            <span className='typeset-headline inline-block text-light-black dark:text-white'>
                                {walletsToLogout.length} addresses?
                            </span>{' '}
                            {`You won’t be able to login again without ${getAddressesType()}.`}
                        </span>
                    ) : (
                        `Are you sure you want to remove this address? You will be unable to log in again using this address without ${
                            wallet?.isLedger() ? 'a Ledger device.' : 'a passphrase.'
                        }`
                    )}
                </p>

                <div className='mt-4 flex items-center justify-center'>
                    <WarningIcon iconClassName='w-[146px] h-[135px]' />
                </div>

                <div className='flex flex-1 flex-col justify-between'>
                    <div className='mt-[18px] flex flex-col gap-1.5'>
                        <p className='typeset-headline font-medium text-subtle-black dark:text-theme-secondary-200'>
                            Enter Password
                        </p>
                        <PasswordInput
                            name='password'
                            variant={validationVariant}
                            onChange={handlePasswordChange}
                            onKeyDown={handleEnterKey}
                            value={password}
                            helperText={
                                validationVariant === 'destructive' ? 'Incorrect password' : ''
                            }
                        />
                    </div>

                    <div className='-mb-2 flex flex-col'>
                        <Button
                            variant='destructivePrimary'
                            onClick={logoutWallet}
                            disabled={!password.length}
                            className='mb-2'
                        >
                            {`Remove Address${walletsToLogout.length > 1 ? 'es' : ''}`}
                        </Button>
                        <Button
                            onClick={() => navigate(-1)}
                            className='mb-0 flex w-full bg-transparent py-0 text-light-black dark:text-white'
                        >
                            <span className='typeset-headline font-medium text-light-black dark:text-white'>
                                Cancel and Go Back
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </SubPageLayout>
    );
};

export default Logout;
