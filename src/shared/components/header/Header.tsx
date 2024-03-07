import { Link, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import cn from 'classnames';
import FocusTrap from 'focus-trap-react';
import styled from 'styled-components';
import { HeaderButton } from './HeaderButton';
import { HeaderWrapper } from './HeaderWrapper';
import { Icon, Paragraph } from '@/shared/components';
import { SettingsMenu } from '@/components/settings/SettingsMenu';
import { AddressesDropdown } from '@/shared/components/header/AddressesDropdown';
import { ConnectionStatus } from '@/components/wallet/ConnectionStatus';
import { LogoIcon } from '@/components/Logo';
import { selectLocked } from '@/lib/store/ui';
import { StyledLogos } from '@/components/settings/others/AboutARK';
import trimAddress from '@/lib/utils/trimAddress';
import { useAppSelector } from '@/lib/store';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { useProfileContext } from '@/lib/context/Profile';
import { CopyAddress } from '@/components/wallet/CopyAddress';

export const Alias = styled(Paragraph)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const Header = () => {
    const [openSettings, setOpenSettings] = useState(false);

    const isLocked = useAppSelector(selectLocked);

    const { profile } = useProfileContext();

    const primaryWallet = usePrimaryWallet();

    const { pathname } = useLocation();
    const isOnboardingPage = pathname.startsWith('/onboarding');

    const addressesTriggerRef = useRef<HTMLButtonElement | null>(null);
    const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

    const [showAddressesDropdown, setShowAddressesDropdown] = useState<boolean>(false);

    if (!primaryWallet || isLocked) {
        return (
            <HeaderWrapper className='py-[17px] px-4' withShadow={!isOnboardingPage}>
                <StyledLogos alignItems='center' gridGap='8px'>
                    <Icon
                        icon='logo-inverted'
                        className='h-6 w-6 text-theme-primary-700 dark:text-theme-primary-650'
                    />
                    <Icon
                        icon='logo-text'
                        className='w-[122px] h-3 text-theme-primary-700 dark:text-theme-primary-650'
                    />
                </StyledLogos>
            </HeaderWrapper>
        );
    }

    const handleAddressDropdownClick = () => {
        setShowAddressesDropdown((prevState) => !prevState);
    };

    const handleSettingsClick = () => {
        setOpenSettings((prevState) => !prevState);
    };

    return (
        <HeaderWrapper withShadow={!isOnboardingPage}>
            <div className=' px-4 relative main-container'>
                <div className='flex justify-between space-x-5 py-px'>
                    <div className='flex items-center flex-1 overflow-auto p-1 -m-1'>
                        {/*Logo*/}
                        <Link to='/'>
                            <LogoIcon className='text-theme-primary-700 dark:text-theme-primary-650' />
                        </Link>

                        {/*Wallets dropdown*/}
                        <div className='flex relative overflow-auto p-1 -m-1'>
                            <HeaderButton
                                selected={showAddressesDropdown}
                                aria-label='Addresses Dropdown'
                                onClick={handleAddressDropdownClick}
                                ref={addressesTriggerRef}
                                className='ml-2 px-2 py-1.5'
                            >
                                <span className='truncate font-medium max-w-[124px] text-light-black dark:text-white'>
                                    {primaryWallet.alias()}
                                </span>

                                <span className='whitespace-nowrap text-theme-secondary-500 dark:text-theme-secondary-200 text-sm'>
                                    {trimAddress(primaryWallet.address(), 7)}
                                </span>

                                <Icon
                                    icon='arrow-down'
                                    className={cn(
                                        'h-4 w-4 transition-transform ease-in-out text-light-black dark:text-white',
                                        {
                                            'transform rotate-180': showAddressesDropdown,
                                        },
                                    )}
                                />
                            </HeaderButton>
                        </div>
                    </div>

                    <div className='flex items-center'>
                        <CopyAddress />

                        <ConnectionStatus />

                        <HeaderButton
                            className='rounded-full'
                            onClick={handleSettingsClick}
                            ref={menuTriggerRef}
                            selected={openSettings}
                            aria-label='Settings menu'
                        >
                            <Icon icon='more-vertical' className='h-4 w-4' />
                        </HeaderButton>
                    </div>
                </div>

                <FocusTrap
                    active={showAddressesDropdown}
                    focusTrapOptions={{
                        clickOutsideDeactivates: true,
                        checkCanFocusTrap: () => {
                            return new Promise((resolve) => setTimeout(resolve, 200));
                        },
                    }}
                >
                    <div
                        className={cn('flex absolute w-full mt-5 left-0 dropdown-body', {
                            'dropdown-transition': showAddressesDropdown,
                        })}
                    >
                        <AddressesDropdown
                            addresses={Object.values(profile.wallets().all())}
                            primaryAddress={primaryWallet}
                            triggerRef={addressesTriggerRef}
                            onClose={() => setShowAddressesDropdown(false)}
                        />
                    </div>
                </FocusTrap>

                <FocusTrap
                    active={openSettings}
                    focusTrapOptions={{
                        clickOutsideDeactivates: true,
                        checkCanFocusTrap: () => {
                            return new Promise((resolve) => setTimeout(resolve, 200));
                        },
                    }}
                >
                    <div
                        className={cn('flex absolute w-full mt-5 left-0 dropdown-body', {
                            'dropdown-transition': openSettings,
                        })}
                    >
                        <SettingsMenu
                            triggerRef={menuTriggerRef}
                            onClose={() => setOpenSettings(false)}
                        />
                    </div>
                </FocusTrap>
            </div>
        </HeaderWrapper>
    );
};
