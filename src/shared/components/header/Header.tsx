import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import FocusTrap from 'focus-trap-react';
import cn from 'classnames';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { LogoIcon } from '@/components/Logo';
import { Container, FlexContainer, Icon, Paragraph } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import { ConnectionStatus } from '@/components/wallet/ConnectionStatus';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { selectLocked } from '@/lib/store/ui';
import { useAppSelector } from '@/lib/store';
import { AddressesDropdown } from '@/shared/components/header/AddressesDropdown';
import { useProfileContext } from '@/lib/context/Profile';
import { DropdownMenuContainerProps, SettingsMenu } from '@/components/settings/SettingsMenu';
import { handleSubmitKeyAction } from '@/lib/utils/handleKeyAction';
import { StyledLogos } from '@/components/settings/others/AboutARK';
import { isFirefox } from '@/lib/utils/isFirefox';

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
                <FlexContainer justifyContent='space-between'>
                    <FlexContainer alignItems='center'>
                        {/*Logo*/}
                        <StyledLink to='/'>
                            <LogoIcon className='text-theme-primary-700 dark:text-theme-primary-650' />
                        </StyledLink>

                        {/*Wallets dropdown*/}
                        <FlexContainer position='relative' ref={addressesTriggerRef}>
                            <StyledFlexContainer
                                padding='8'
                                style={{ gap: '4px' }}
                                alignItems='center'
                                marginLeft='8'
                                borderRadius='8'
                                className='c-pointer'
                                onClick={handleAddressDropdownClick}
                                onKeyDown={(e) =>
                                    handleSubmitKeyAction(e, handleAddressDropdownClick)
                                }
                                tabIndex={0}
                                selected={showAddressesDropdown}
                                aria-label='Addresses Dropdown'
                            >
                                <Alias color='base' maxWidth='124px' fontWeight='medium' as='span'>
                                    {' '}
                                    {primaryWallet.alias()}{' '}
                                </Alias>
                                <Paragraph color='label' as='span'>
                                    {trimAddress(primaryWallet.address(), 7)}
                                </Paragraph>
                                <FlexContainer alignSelf='self-end' color='base' as='span'>
                                    <Icon
                                        icon='arrow-down'
                                        className={cn(
                                            'h-4 w-4 transition-transform ease-in-out delay-150',
                                            {
                                                'transform rotate-180': showAddressesDropdown,
                                            },
                                        )}
                                    />
                                </FlexContainer>
                            </StyledFlexContainer>
                        </FlexContainer>
                    </FlexContainer>
                    <FlexContainer alignItems='center'>
                        <ConnectionStatus />

                        {/*Menu trigger*/}
                        <StyledFlexContainer
                            padding='8'
                            style={{ gap: '4px' }}
                            alignItems='center'
                            marginLeft='8'
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
