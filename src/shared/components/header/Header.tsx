import { Link, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import cn from 'classnames';
import FocusTrap from 'focus-trap-react';
import styled from 'styled-components';
import { Container, FlexContainer, Icon, Paragraph } from '@/shared/components';
import { DropdownMenuContainerProps, SettingsMenu } from '@/components/settings/SettingsMenu';

import { AddressesDropdown } from '@/shared/components/header/AddressesDropdown';
import { ConnectionStatus } from '@/components/wallet/ConnectionStatus';
import { handleSubmitKeyAction } from '@/lib/utils/handleKeyAction';
import { isFirefox } from '@/lib/utils/isFirefox';
import { LogoIcon } from '@/components/Logo';
import { selectLocked } from '@/lib/store/ui';
import { StyledLogos } from '@/components/settings/others/AboutARK';
import trimAddress from '@/lib/utils/trimAddress';
import { useAppSelector } from '@/lib/store';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { useProfileContext } from '@/lib/context/Profile';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { CopyAddress } from '@/components/wallet/CopyAddress';

export const StyledFlexContainer = styled(FlexContainer)<DropdownMenuContainerProps>`
    ${(props) => `
  transition: ${isFirefox ? 'background 0.2s ease-in-out' : 'all 0.2s ease-in-out'};
  &:hover {
    background-color: ${props.theme.colors.lightGrayHover}
  }
  background-color: ${props.selected && props.theme.colors.lightGrayHover};

  ${isFirefox ? props.theme.browserCompatibility.firefox.focus : ''}
`}
`;

export const StyledHeader = styled.header<{
    isDark: boolean;
    padding?: string;
    withShadow?: boolean;
}>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: ${({ withShadow, isDark }) =>
        withShadow
            ? `0 1px 4px 0 ${isDark ? 'rgba(165, 165, 165, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`
            : 'none'};
    padding: ${({ theme, padding }) => padding ?? theme.space['16'] + 'px'};
    background-color: ${(props) =>
        props.isDark ? props.theme.colors.subtleBlack : props.theme.colors.white};
`;

export const Alias = styled(Paragraph)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledLink = styled(Link)`
    ${({ theme }) => (isFirefox ? theme.browserCompatibility.firefox.focus : '')}
`;

export const Header = () => {
    const { isDark } = useThemeMode();
    const [openSettings, setOpenSettings] = useState(false);

    const isLocked = useAppSelector(selectLocked);

    const { profile } = useProfileContext();

    const primaryWallet = usePrimaryWallet();

    const { pathname } = useLocation();
    const isOnboardingPage = pathname.startsWith('/onboarding');

    const addressesTriggerRef = useRef<HTMLDivElement | null>(null);
    const menuTriggerRef = useRef<HTMLDivElement | null>(null);

    const [showAddressesDropdown, setShowAddressesDropdown] = useState<boolean>(false);

    if (!primaryWallet || isLocked) {
        return (
            <StyledHeader isDark={isDark()} padding='17px 16px' withShadow={!isOnboardingPage}>
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
            </StyledHeader>
        );
    }

    const handleAddressDropdownClick = () => {
        setShowAddressesDropdown((prevState) => !prevState);
    };

    const handleSettingsClick = () => {
        setOpenSettings((prevState) => !prevState);
    };

    return (
        <StyledHeader isDark={isDark()} padding='12px 0' withShadow={!isOnboardingPage}>
            <Container
                className='main-container'
                paddingLeft='16'
                paddingRight='16'
                position='relative'
            >
                <FlexContainer justifyContent='space-between' className='space-x-5'>
                    <FlexContainer alignItems='center' className='flex-1 overflow-auto p-1 -m-1'>
                        {/*Logo*/}
                        <StyledLink to='/'>
                            <LogoIcon className='text-theme-primary-700 dark:text-theme-primary-650' />
                        </StyledLink>

                        {/*Wallets dropdown*/}

                        <div
                            className='flex relative overflow-auto p-1 -m-1'
                            ref={addressesTriggerRef}
                        >
                            <button
                                className={cn(
                                    'p-2 gap-1 items-center flex ml-2 rounded-lg overflow-auto cursor-pointer transition duration-200 ease-in-out',
                                    {
                                        'bg-theme-secondary-50 dark:bg-theme-secondary-700':
                                            showAddressesDropdown,
                                        'hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700':
                                            !showAddressesDropdown,
                                    },
                                )}
                                aria-label='Addresses Dropdown'
                                onClick={handleAddressDropdownClick}
                            >
                                <span className='truncate font-medium leading-tight max-w-[124px] text-light-black dark:text-white'>
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
                            </button>
                        </div>
                    </FlexContainer>
                    <FlexContainer alignItems='center'>
                        <CopyAddress />

                        <ConnectionStatus />

                        {/*Menu trigger*/}
                        <StyledFlexContainer
                            padding='8'
                            style={{ gap: '4px' }}
                            alignItems='center'
                            borderRadius='50'
                            className='c-pointer'
                            onClick={handleSettingsClick}
                            ref={menuTriggerRef}
                            color='base'
                            selected={openSettings}
                            aria-label='Settings menu'
                            onKeyDown={(e) => handleSubmitKeyAction(e, handleSettingsClick)}
                            tabIndex={0}
                        >
                            <Icon icon='more-vertical' className='h-4 w-4' />
                        </StyledFlexContainer>
                    </FlexContainer>
                </FlexContainer>

                <FocusTrap
                    active={showAddressesDropdown}
                    focusTrapOptions={{
                        clickOutsideDeactivates: true,
                        checkCanFocusTrap: () => {
                            return new Promise((resolve) => setTimeout(resolve, 200));
                        },
                    }}
                >
                    <FlexContainer
                        position='absolute'
                        left='0'
                        marginTop='20'
                        width='100%'
                        className={`dropdown-body ${
                            showAddressesDropdown ? 'dropdown-transition' : ''
                        }`}
                    >
                        <AddressesDropdown
                            addresses={Object.values(profile.wallets().all())}
                            primaryAddress={primaryWallet}
                            triggerRef={addressesTriggerRef}
                            onClose={() => setShowAddressesDropdown(false)}
                        />
                    </FlexContainer>
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
                    <FlexContainer
                        position='absolute'
                        left='0'
                        marginTop='20'
                        width='100%'
                        className={`dropdown-body ${openSettings ? 'dropdown-transition' : ''}`}
                    >
                        <SettingsMenu
                            triggerRef={menuTriggerRef}
                            onClose={() => setOpenSettings(false)}
                        />
                    </FlexContainer>
                </FocusTrap>
            </Container>
        </StyledHeader>
    );
};
