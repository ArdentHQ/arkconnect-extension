import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import { Container, FlexContainer, Paragraph, ToggleSwitch } from '@/shared/components';
import { SettingsOption } from '@/components/settings/SettingsOption';
import { lockedChanged } from '@/lib/store/ui';
import { selectWalletsIds } from '@/lib/store/wallet';
import { useProfileContext } from '@/lib/context/Profile';
import { AutoLockTimer as AutoLockTimerEnum, getLocalValues } from '@/lib/utils/localStorage';
import showAutoLockTimerValue from '@/lib/utils/showAutoLockTimerValue';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import useThemeMode from '@/lib/hooks/useThemeMode';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import { handleInputKeyAction, handleSubmitKeyAction } from '@/lib/utils/handleKeyAction';
import SafeOutlineOverflowContainer from '@/shared/components/layout/SafeOutlineOverflowContainer';
export interface DropdownMenuContainerProps {
    selected?: boolean;
}

export const SettingsMenu = ({
    onClose,
    triggerRef,
}: {
    onClose: () => void;
    triggerRef: React.RefObject<HTMLElement | null>;
}) => {
    const dispatch = useAppDispatch();
    const walletsIds = useAppSelector(selectWalletsIds);
    const { toggleThemeMode, isDark } = useThemeMode();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { profile } = useProfileContext();

    const [autoLockTimer, setAutoLockTimer] = useState<AutoLockTimerEnum | undefined>(undefined);

    const handleNavigation = (route: string, options?: NavigateOptions) => {
        onClose();
        if (pathname !== route) {
            navigate(route, options);
        }
    };

    const lockExtension = async () => {
        await runtime.sendMessage({ type: 'LOCK' });
        dispatch(lockedChanged(true));
    };

    useEffect(() => {
        (async () => {
            const { autoLockTimer } = await getLocalValues();

            setAutoLockTimer(autoLockTimer);
        })();
    }, []);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useOnClickOutside(dropdownRef, onClose, triggerRef as React.RefObject<HTMLButtonElement>);

    const handleRemoveAddressClick = () => {
        onClose();
        if (walletsIds.length > 1) {
            handleNavigation('/multiple-wallet-logout');
        } else {
            handleNavigation('/logout', { state: walletsIds });
        }
    };

    return (
        <Container
            marginX='16'
            width='100%'
            ref={dropdownRef}
            borderRadius='12'
            boxShadow='0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)'
            backgroundColor='secondaryBackground'
        >
            <SafeOutlineOverflowContainer width='100%' marginLeft='0' paddingX='0'>
                <FlexContainer paddingY='8' width='100%' display='flex' flexDirection='column'>
                    <SettingsOption
                        title='Create & Import Address'
                        iconLeading='plus-circle'
                        onClick={() => {
                            handleNavigation('/create-import-address');
                        }}
                        iconTrailing='arrow-right'
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () =>
                                handleNavigation('/create-import-address'),
                            )
                        }
                    />
                    <SettingsOption
                        title='Connected Apps'
                        iconLeading='app'
                        onClick={() => handleNavigation('/connections')}
                        iconTrailing='arrow-right'
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () => handleNavigation('/connections'))
                        }
                    />
                    <SettingsOption
                        title='Lock Extension'
                        iconLeading='lock'
                        onClick={lockExtension}
                        onKeyDown={(e) => handleSubmitKeyAction(e, lockExtension)}
                    />
                    <SettingsOption
                        title='Dark Mode'
                        iconLeading='moon'
                        color='lightBlack'
                        onClick={(evt) => toggleThemeMode(evt)}
                        rightContent={
                            <Container>
                                <ToggleSwitch
                                    checked={isDark()}
                                    onChange={(evt) => toggleThemeMode(evt)}
                                    id='toggle-theme'
                                />
                            </Container>
                        }
                        onKeyDown={(e) =>
                            handleInputKeyAction(
                                e,
                                toggleThemeMode,
                                e as unknown as ChangeEvent<HTMLInputElement>,
                            )
                        }
                    />
                    <SettingsOption
                        title='Change Password'
                        iconLeading='shield-border'
                        iconTrailing='arrow-right'
                        color='lightBlack'
                        onClick={() => handleNavigation('/local-password')}
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () => handleNavigation('/local-password'))
                        }
                    />
                    <SettingsOption
                        title='Change Local Currency'
                        iconLeading='currency-dollar-circle'
                        rightContent={
                            <Paragraph
                                $typeset='headline'
                                fontWeight='regular'
                                color='gray'
                                mr='8'
                                size='16'
                            >
                                {`${profile
                                    .settings()
                                    .get(Contracts.ProfileSetting.ExchangeCurrency)}`}
                            </Paragraph>
                        }
                        iconTrailing='arrow-right'
                        onClick={() => handleNavigation('/local-currency')}
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () => handleNavigation('/local-currency'))
                        }
                    />
                    <SettingsOption
                        title='Auto Lock Timer'
                        iconLeading='clock'
                        rightContent={
                            <Paragraph
                                $typeset='headline'
                                fontWeight='regular'
                                color='gray'
                                mr='8'
                                size='16'
                            >
                                {autoLockTimer ? showAutoLockTimerValue(autoLockTimer) : ''}
                            </Paragraph>
                        }
                        iconTrailing='arrow-right'
                        onClick={() => {
                            handleNavigation('/autolock-timer', {
                                state: {
                                    autoLockTimer,
                                },
                            });
                        }}
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () =>
                                handleNavigation('/autolock-timer', { state: { autoLockTimer } }),
                            )
                        }
                    />
                    <SettingsOption
                        title='About ARK Connect'
                        iconLeading='support'
                        iconTrailing='arrow-right'
                        onClick={() => handleNavigation('/about')}
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () => handleNavigation('/about'))
                        }
                    />
                    <SettingsOption
                        title='Remove Addresses'
                        iconLeading='trash'
                        iconTrailing='arrow-right'
                        onClick={handleRemoveAddressClick}
                        variant='error'
                        onKeyDown={(e) => handleSubmitKeyAction(e, handleRemoveAddressClick)}
                    />
                </FlexContainer>
            </SafeOutlineOverflowContainer>
        </Container>
    );
};
