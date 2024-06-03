import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Contracts } from '@ardenthq/sdk-profiles';
import { runtime } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import { AutoLockTimer as AutoLockTimerEnum, getLocalValues } from '@/lib/utils/localStorage';
import { handleInputKeyAction, handleSubmitKeyAction } from '@/lib/utils/handleKeyAction';
import { HeadingDescription, ToggleSwitch } from '@/shared/components';
import { lockedChanged, ThemeAccent } from '@/lib/store/ui';
import { useAppDispatch, useAppSelector } from '@/lib/store';

import SafeOutlineOverflowContainer from '@/shared/components/layout/SafeOutlineOverflowContainer';
import { selectWalletsIds } from '@/lib/store/wallet';
import { SettingsOption } from '@/components/settings/SettingsOption';
import showAutoLockTimerValue from '@/lib/utils/showAutoLockTimerValue';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import { useProfileContext } from '@/lib/context/Profile';
import useThemeMode from '@/lib/hooks/useThemeMode';

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
    const { toggleThemeMode, isDark, toggleThemeAccent, currentThemeAccent } = useThemeMode();
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
            className='mx-4 w-full rounded-xl bg-white shadow-dropdown dark:bg-subtle-black dark:shadow-dropdown-dark'
            ref={dropdownRef}
        >
            <SafeOutlineOverflowContainer className='custom-scroll ml-0 max-h-[32rem] w-full overflow-y-auto px-0'>
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
                        title={t('PAGES.SETTINGS.MENU.VOTE')}
                        iconLeading='arrow-right'
                        onClick={() => handleNavigation('/connections')}
                        iconTrailing='vote'
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () => handleNavigation('/connections'))
                        }
                    />
                    <SettingsOption
                        title={t('PAGES.SETTINGS.MENU.ADDRESS_BOOK')}
                        iconLeading='users'
                        iconContainerClassName='overflow-visible'
                        iconTrailing='arrow-right'
                        onClick={() => handleNavigation('/address-book')}
                        onKeyDown={(e) =>
                            handleSubmitKeyAction(e, () => handleNavigation('/address-book'))
                        }
                    />
                    <SettingsOption
                        title={t('PAGES.SETTINGS.MENU.LOCK_EXTENSION')}
                        iconLeading='lock'
                        onClick={lockExtension}
                        onKeyDown={(e) => handleSubmitKeyAction(e, lockExtension)}
                    />
                    <SettingsOption
                        title={t('PAGES.SETTINGS.MENU.THEME')}
                        iconLeading='sparkles'
                        iconClassName='text-light-black'
                        onClick={(evt) => toggleThemeAccent(evt)}
                        rightContent={
                            <div className='flex items-center space-x-2'>
                                <button
                                    type='button'
                                    className={classNames(
                                        'flex h-5 w-5 items-center justify-center rounded-full',
                                        {
                                            'bg-theme-navy-100 outline outline-1 outline-theme-navy-600 dark:bg-theme-navy-900':
                                                currentThemeAccent === ThemeAccent.NAVY,
                                            'bg-theme-secondary-200 dark:bg-theme-secondary-700':
                                                currentThemeAccent !== ThemeAccent.NAVY,
                                        },
                                    )}
                                >
                                    <span className='block h-4 w-4 rounded-full bg-theme-navy-600'></span>
                                </button>

                                <button
                                    type='button'
                                    className={classNames(
                                        'flex h-5 w-5 items-center justify-center rounded-full',
                                        {
                                            'bg-theme-green-100 outline outline-1 outline-theme-green-600 dark:bg-theme-green-900':
                                                currentThemeAccent === ThemeAccent.GREEN,
                                            'bg-theme-secondary-200 dark:bg-theme-secondary-700':
                                                currentThemeAccent !== ThemeAccent.GREEN,
                                        },
                                    )}
                                >
                                    <span className='block h-4 w-4 rounded-full bg-theme-green-700 dark:bg-theme-green-600'></span>
                                </button>
                            </div>
                        }
                        onKeyDown={(e) =>
                            handleInputKeyAction(
                                e,
                                toggleThemeAccent,
                                e as unknown as ChangeEvent<HTMLInputElement>,
                            )
                        }
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
