import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { runtime } from 'webextension-polyfill';
import { Button, FlexContainer, Paragraph, PasswordInput, WarningIcon } from '@/shared/components';
import { ValidationVariant } from '@/components/wallet/create';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import * as WalletStore from '@/lib/store/wallet';
import * as SessionStore from '@/lib/store/session';
import { useProfileContext } from '@/lib/context/Profile';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { isValidPassword } from '@/lib/utils/validations';
import { ExtensionEvents } from '@/lib/events';
import useThemeMode from '@/lib/hooks/useThemeMode';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useResetExtension from '@/lib/hooks/useResetExtension';

const Logout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { initProfile, profile } = useProfileContext();
    const [password, setPassword] = useState<string>('');
    const [validationVariant, setValidationVariant] = useState<ValidationVariant>('primary');
    const { getThemeColor } = useThemeMode();
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
        >
            <FlexContainer height='100%' flexDirection='column'>
                <Paragraph
                    $typeset='headline'
                    fontWeight='regular'
                    color={getThemeColor('secondary500', 'secondary300')}
                >
                    {walletsToLogout && walletsToLogout.length > 1 ? (
                        <Paragraph as='span' $typeset='headline'>
                            Are you sure you want to remove{' '}
                            <Paragraph
                                as='span'
                                color='base'
                                fontWeight='regular'
                                $typeset='headline'
                                display='inline-block'
                            >
                                {walletsToLogout.length} addresses?
                            </Paragraph>{' '}
                            {`You won’t be able to login again without ${getAddressesType()}.`}
                        </Paragraph>
                    ) : (
                        `Are you sure you want to remove this address? You will be unable to log in again using this address without ${
                            wallet?.isLedger() ? 'a Ledger device.' : 'a passphrase.'
                        }`
                    )}
                </Paragraph>

                <FlexContainer justifyContent='center' alignContent='center' mt='16'>
                    <WarningIcon width='146px' height='135px' />
                </FlexContainer>

                <FlexContainer mt='24' flexDirection='column' gridGap='6'>
                    <Paragraph $typeset='headline' fontWeight='medium' color='labelText'>
                        Enter Password
                    </Paragraph>
                    <PasswordInput
                        name='password'
                        variant={validationVariant}
                        onChange={handlePasswordChange}
                        onKeyDown={handleEnterKey}
                        value={password}
                        helperText={validationVariant === 'destructive' ? 'Incorrect password' : ''}
                    />
                </FlexContainer>

                <FlexContainer mt='48' flexDirection='column'>
                    <Button
                        variant='destructivePrimary'
                        onClick={logoutWallet}
                        disabled={!password.length}
                        mb='24'
                    >
                        {`Remove Address${walletsToLogout.length > 1 ? 'es' : ''}`}
                    </Button>
                    <Button
                        onClick={() => navigate(-1)}
                        width='100%'
                        display='flex'
                        color='base'
                        backgroundColor='transparent'
                        py='0'
                        mb='0'
                    >
                        <Paragraph $typeset='headline' fontWeight='medium' color='base' as='span'>
                            Cancel and Go Back
                        </Paragraph>
                    </Button>
                </FlexContainer>
            </FlexContainer>
        </SubPageLayout>
    );
};

export default Logout;
