import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { runtime, windows } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import { Contracts } from '@/lib/profiles';
import { AutoLockTimer as AutoLockTimerEnum, getLocalValues } from '@/lib/utils/localStorage';
import { handleInputKeyAction, handleSubmitKeyAction } from '@/lib/utils/handleKeyAction';
import { HeadingDescription, ToggleSwitch } from '@/shared/components';
import { lockedChanged, ThemeAccent } from '@/lib/store/ui';
import { useAppDispatch, useAppSelector } from '@/lib/store';

import SafeOutlineOverflowContainer from '@/shared/components/layout/SafeOutlineOverflowContainer';
import { Network, selectWalletsIds } from '@/lib/store/wallet';
import { SettingsOption } from '@/components/settings/SettingsOption';
import showAutoLockTimerValue from '@/lib/utils/showAutoLockTimerValue';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import { useProfileContext } from '@/lib/context/Profile';
import useThemeMode from '@/lib/hooks/useThemeMode';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { openSidepanel } from '@/lib/background/sidepanel';

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

    const { activeNetwork, setActiveNetwork } = useActiveNetwork();

    const [autoLockTimer, setAutoLockTimer] = useState<AutoLockTimerEnum | undefined>(undefined);
    const [openInSidepanel, setOpenInSidepanel] = useState(false);

    const handleNavigation = (route: string, options?: NavigateOptions) => {
        onClose();
        if (pathname !== route) {
            navigate(route, options);
        }
    };

    const toggleNetwork = () => {
        void setActiveNetwork(
            activeNetwork.id() === Network.DEVNET ? Network.MAINNET : Network.DEVNET,
        );
    };

    const lockExtension = async () => {
        await runtime.sendMessage({ type: 'LOCK' });
        dispatch(lockedChanged(true));
    };

    useEffect(() => {
        (async () => {
            const { autoLockTimer, openInSidepanel } = await getLocalValues();

            setAutoLockTimer(autoLockTimer);
            setOpenInSidepanel(openInSidepanel ?? false);
        })();
    }, []);

    const toggleSidepanel = async (evt: ChangeEvent<HTMLInputElement> | React.MouseEvent) => {
        evt.stopPropagation();

        const next = !openInSidepanel;

        setOpenInSidepanel(next);

        const win = await windows.getCurrent();

        await runtime.sendMessage({
            type: 'SET_OPEN_IN_SIDEPANEL',
            data: { enabled: next, windowId: win.id },
        });

        if (next && win.id !== undefined) {
            // Must be called in the popup while the user gesture is still active;
            // the background service worker context doesn't satisfy the gesture requirement.
            await openSidepanel(win.id);
        }

        window.close();
    };

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
            className='shadow-dropdown dark:bg-subtle-black dark:shadow-dropdown-dark mx-4 w-full rounded-xl bg-white'
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
                        iconLeading='vote'
                        onClick={() => handleNavigation('/vote')}
                        iconTrailing='arrow-right'
                        onKeyDown={(e) => handleSubmitKeyAction(e, () => handleNavigation('/vote'))}
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
                                            'bg-theme-navy-100 outline-theme-navy-600 dark:bg-theme-navy-900 outline-1':
                                                currentThemeAccent === ThemeAccent.NAVY,
                                            'bg-theme-secondary-200 dark:bg-theme-secondary-700':
                                                currentThemeAccent !== ThemeAccent.NAVY,
                                        },
                                    )}
                                >
                                    <span className='bg-theme-navy-600 block h-4 w-4 rounded-full'></span>
                                </button>

                                <button
                                    type='button'
                                    className={classNames(
                                        'flex h-5 w-5 items-center justify-center rounded-full',
                                        {
                                            'bg-theme-green-100 outline-theme-green-600 dark:bg-theme-green-900 outline-1':
                                                currentThemeAccent === ThemeAccent.GREEN,
                                            'bg-theme-secondary-200 dark:bg-theme-secondary-700':
                                                currentThemeAccent !== ThemeAccent.GREEN,
                                        },
                                    )}
                                >
                                    <span className='bg-theme-green-700 dark:bg-theme-green-600 block h-4 w-4 rounded-full'></span>
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
                        title={t('PAGES.SETTINGS.MENU.USE_TESTNET')}
                        iconLeading='globe'
                        iconClassName='text-light-black'
                        onClick={() => toggleNetwork()}
                        rightContent={
                            <div>
                                <ToggleSwitch
                                    checked={activeNetwork.id() === Network.DEVNET}
                                    onChange={() => toggleNetwork()}
                                    id='toggle-network'
                                />
                            </div>
                        }
                        onKeyDown={(e) =>
                            handleInputKeyAction(
                                e,
                                toggleNetwork,
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
                        title={t('PAGES.SETTINGS.MENU.OPEN_IN_SIDEPANEL')}
                        iconLeading='view-grid'
                        iconClassName='text-light-black'
                        onClick={(evt) => toggleSidepanel(evt)}
                        rightContent={
                            <div>
                                <ToggleSwitch
                                    checked={openInSidepanel}
                                    onChange={(evt) => toggleSidepanel(evt)}
                                    id='toggle-sidepanel'
                                />
                            </div>
                        }
                        onKeyDown={(e) =>
                            handleInputKeyAction(
                                e,
                                toggleSidepanel,
                                e as unknown as ChangeEvent<HTMLInputElement>,
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
