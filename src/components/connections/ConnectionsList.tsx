import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { DisconnectSessionModal } from '../wallet/DisconnectSessionModal';
import ConnectionLogoImage from './ConnectionLogoImage';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { useAppSelector } from '@/lib/store';
import * as SessionStore from '@/lib/store/session';
import { ThemeMode } from '@/lib/store/ui';
import { Button, Container, FlexContainer, Icon, Paragraph, Tooltip } from '@/shared/components';
import formatDomain from '@/lib/utils/formatDomain';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import trimAddress from '@/lib/utils/trimAddress';
import { useProfileContext } from '@/lib/context/Profile';
import { selectPrimaryWalletId } from '@/lib/store/wallet';
import { isFirefox } from '@/lib/utils/isFirefox';

const ConnectionsList = () => {
    const location = useLocation();
    const { currentThemeMode } = useThemeMode();
    const sessions = useAppSelector(SessionStore.selectSessions);
    const { profile } = useProfileContext();
    const primaryWalletId = useAppSelector(selectPrimaryWalletId);
    const [sessionsToRemove, setSessionsToRemove] = useState<SessionStore.Session[]>([]);

    const getWalletName = (walletId: string) => {
        const wallet = profile.wallets().findById(walletId);

        const displayName = wallet.displayName();

        return displayName ? displayName : trimAddress(wallet.address(), 'short');
    };

    const getSessionByUrl = (sessions: SessionStore.Session[]) => {
        return Object.values(sessions).find(
            (session) =>
                session.domain === location.state?.domain && session.walletId === primaryWalletId,
        );
    };

    useEffect(() => {
        // Check whether the view is within a standalone popup,
        // and open removal confirmation modal on initial render.
        const popupSession = getSessionByUrl(Object.values(sessions));

        if (popupSession) {
            setSessionsToRemove([popupSession]);
        }
    }, [location.state, primaryWalletId, sessions]);

    return (
        <Container>
            <FlexContainer flexDirection='column' gridGap='8px' mb='8'>
                {Object.values(sessions).map((session) => {
                    return (
                        <StyledRow key={session.id}>
                            <FlexContainer
                                width='40px'
                                height='40px'
                                alignItems='center'
                                justifyContent='center'
                                borderRadius='50%'
                                overflow='hidden'
                                backgroundColor={
                                    currentThemeMode === ThemeMode.LIGHT ? 'secondary50' : 'black'
                                }
                                className='flex-shrink-0'
                            >
                                <ConnectionLogoImage
                                    appLogo={session.logo}
                                    alt={session.domain}
                                    roundCorners
                                />
                            </FlexContainer>

                            <div className='flex flex-1 flex-col justify-between'>
                                <div>
                                    <Tooltip
                                        content={
                                            <StyledSpan>
                                                {formatDomain(session.domain, false)}
                                            </StyledSpan>
                                        }
                                        placement='top'
                                    >
                                        <Paragraph
                                            $typeset='headline'
                                            fontWeight='medium'
                                            color='base'
                                        >
                                            {formatDomain(session.domain, false)}
                                        </Paragraph>
                                    </Tooltip>
                                </div>

                                <Tooltip
                                    content={profile.wallets().findById(session.walletId).address()}
                                    placement='bottom-start'
                                >
                                    <Paragraph
                                        $typeset='body'
                                        color='gray'
                                        fontWeight='regular'
                                        mt='4'
                                        display='inline'
                                    >
                                        Connected with{' '}
                                        <strong>
                                            {trimAddress(getWalletName(session.walletId), 14)}
                                        </strong>
                                    </Paragraph>
                                </Tooltip>
                            </div>

                            <Tooltip content='Disconnect' placement='left'>
                                <StyledFlexContainer
                                    isDark={currentThemeMode === ThemeMode.DARK}
                                    width='32px'
                                    height='32px'
                                    alignItems='center'
                                    justifyContent='center'
                                    borderRadius='50%'
                                    onClick={() => {
                                        setSessionsToRemove([session]);
                                    }}
                                    as='button'
                                    className='flex-shrink-0'
                                >
                                    <Icon
                                        icon='slash'
                                        className='h-4.5 w-4.5 text-theme-error-600 dark:text-theme-error-500'
                                    />
                                </StyledFlexContainer>
                            </Tooltip>
                        </StyledRow>
                    );
                })}
            </FlexContainer>
            <Button
                variant='destructiveSecondary'
                onClick={() => {
                    setSessionsToRemove(Object.values(sessions));
                }}
                className='mt-4'
            >
                Disconnect All
            </Button>

            <DisconnectSessionModal
                sessions={sessionsToRemove}
                isOpen={sessionsToRemove.length > 0}
                onCancel={async () => {
                    if (getSessionByUrl(sessionsToRemove)) {
                        await removeWindowInstance(location.state?.windowId, 100);
                    }

                    setSessionsToRemove([]);
                }}
                onConfirm={async () => {
                    if (getSessionByUrl(sessionsToRemove)) {
                        await removeWindowInstance(location.state?.windowId, 100);
                    }

                    setSessionsToRemove([]);
                }}
            />
        </Container>
    );
};

const StyledRow = styled.div`
    ${({ theme }) => `
  border-radius: ${theme.radii['16']}px;
  background-color: ${theme.colors.inputBackground};
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 58px;
  padding: 12px;
  grid-gap: 12px;
  position: relative;
`}
`;

const StyledFlexContainer = styled(FlexContainer)<{ isDark?: boolean }>`
    cursor: pointer;
    color: ${({ theme, isDark }) => (isDark ? theme.colors.error500 : theme.colors.error600)};
    transition: ${({ theme }) =>
        isFirefox ? theme.transitions.firefoxSmoothEase : theme.transitions.smoothEase};
    border: none;
    background: ${({ theme }) => theme.colors.transparent};

    &:hover {
        ${({ theme, isDark }) => `
      background-color: ${isDark ? theme.colors.secondary700 : theme.colors.secondary50};
    `}
    }

    ${({ theme }) => (isFirefox ? theme.browserCompatibility.firefox.focus : '')}
`;

const StyledSpan = styled.span`
    word-wrap: break-word;
`;

export default ConnectionsList;
