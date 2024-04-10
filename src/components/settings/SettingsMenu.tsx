import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import { HeadingDescription, ToggleSwitch } from '@/shared/components';
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
    const { t } = useTranslation();
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
        <div
            className='mx-4 w-full rounded-xl bg-white shadow-dropdown dark:bg-subtle-black'
            ref={dropdownRef}
        >
            <SafeOutlineOverflowContainer className='ml-0 w-full px-0'>
                <div className='flex w-full flex-col py-2'>
                    <SettingsOption
                        title={t('PAGES.SETTINGS.MENU.CREATE_N_IMPORT_ADDRESS')}
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
                        title={t('PAGES.SETTINGS.MENU.CONNECTED_APPS')}
                        iconLeading='app'
                        onClick={() => handleNavigation('/connections')}
                        iconTrailing='arrow-right'
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () => handleNavigation('/connections'))
                        }
                    />
                    <SettingsOption
                        title={t('PAGES.SETTINGS.MENU.LOCK_EXTENSION')}
                        iconLeading='lock'
                        onClick={lockExtension}
                        onKeyDown={(e) => handleSubmitKeyAction(e, lockExtension)}
                    />
                    <SettingsOption
                        title={t('PAGES.SETTINGS.MENU.DARK_MODE')}
                        iconLeading='moon'
                        iconClassName='text-light-black'
                        onClick={(evt) => toggleThemeMode(evt)}
                        rightContent={
                            <div>
                                <ToggleSwitch
                                    checked={isDark()}
                                    onChange={(evt) => toggleThemeMode(evt)}
                                    id='toggle-theme'
                                />
                            </div>
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
                        title={t('PAGES.SETTINGS.MENU.CHANGE_PASSWORD')}
                        iconLeading='shield-border'
                        iconTrailing='arrow-right'
                        iconClassName='text-light-black'
                        onClick={() => handleNavigation('/local-password')}
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () => handleNavigation('/local-password'))
                        }
                    />
                    <SettingsOption
                        title={t('PAGES.SETTINGS.MENU.CHANGE_LOCAL_CURRENCY')}
                        iconLeading='currency-dollar-circle'
                        rightContent={
                            <HeadingDescription className='mr-2 text-base font-normal'>
                                {`${profile
                                    .settings()
                                    .get(Contracts.ProfileSetting.ExchangeCurrency)}`}
                            </HeadingDescription>
                        }
                        iconTrailing='arrow-right'
                        onClick={() => handleNavigation('/local-currency')}
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () => handleNavigation('/local-currency'))
                        }
                    />
                    <SettingsOption
                        title={t('PAGES.SETTINGS.MENU.AUTO_LOCK_TIMER')}
                        iconLeading='clock'
                        rightContent={
                            <HeadingDescription className='mr-2 text-base font-normal'>
                                {autoLockTimer ? showAutoLockTimerValue(autoLockTimer) : ''}
                            </HeadingDescription>
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
                        title={t('PAGES.SETTINGS.MENU.ABOUT_ARK_CONNECT')}
                        iconLeading='support'
                        iconTrailing='arrow-right'
                        onClick={() => handleNavigation('/about')}
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () => handleNavigation('/about'))
                        }
                    />
                    <SettingsOption
                        title={t('PAGES.SETTINGS.MENU.REMOVE_ADDRESSES')}
                        iconLeading='trash'
                        iconTrailing='arrow-right'
                        onClick={handleRemoveAddressClick}
                        variant='error'
                        onKeyDown={(e) => handleSubmitKeyAction(e, handleRemoveAddressClick)}
                    />
                </div>
            </SafeOutlineOverflowContainer>
        </div>
    );
};
