import useThemeMode from '@/lib/hooks/useThemeMode';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import * as SessionStore from '@/lib/store/session';
import { ThemeMode } from '@/lib/store/ui';
import Modal from '@/shared/components/modal/Modal';
import { Button, Container, FlexContainer, Icon, Paragraph, Tooltip } from '@/shared/components';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import RemoveConnections from './RemoveConnections';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useLocation } from 'react-router-dom';
import browser from 'webextension-polyfill';
import formatDomain from '@/lib/utils/formatDomain';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import ConnectionLogoImage from './ConnectionLogoImage';
import trimAddress from '@/lib/utils/trimAddress';
import { useProfileContext } from '@/lib/context/Profile';
import * as WalletStore from '@/lib/store/wallet';
import { isFirefox } from '@/lib/utils/isFirefox';

type StateProps = {
  sessionDomain?: string;
  numberOfSessions?: number;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const initialState: StateProps = {
  sessionDomain: undefined,
  numberOfSessions: 0,
  isOpen: false,
  onConfirm: () => {
    return;
  },
  onCancel: () => {
    return;
  },
};

const ConnectionsList = () => {
  const location = useLocation();
  const { currentThemeMode } = useThemeMode();
  const sessions = useAppSelector(SessionStore.selectSessions);
  const { profile } = useProfileContext();
  const [state, setState] = useState<StateProps>(initialState);
  const { onError } = useErrorHandlerContext();
  const dispatch = useAppDispatch();
  const primaryWalletId = useAppSelector(WalletStore.selectPrimaryWalletId);

  const getWalletName = (walletId: string) => {
    const wallet = profile.wallets().findById(walletId);

    const displayName = wallet.displayName();

    return displayName ? displayName : trimAddress(wallet.address(), 'short');
  };

  const getWalletAddress = (walletId: string) => {
    const wallet = profile.wallets().findById(walletId);

    return wallet.address();
  };

  const disconnectSessions = async (sessions: SessionStore.Session[]) => {
    await dispatch(SessionStore.sessionRemoved(sessions.map((s) => s.id)));

    await browser.runtime.sendMessage({
      type: 'DISCONNECT_RESOLVE',
      data: {
        domain: sessions[0].domain,
        status: 'success',
        disconnected: false,
      },
    });
  };

  useEffect(() => {
    (async () => {
      const session = Object.values(sessions).find(
        (s) => s.domain === location.state?.domain && s.walletId === primaryWalletId,
      );

      if (session) {
        const confirmed = await confirm({
          sessionDomain: session.domain,
        });

        if (!confirmed) {
          await removeWindowInstance(location.state?.windowId, 1000);
          return;
        }

        await disconnectSessions([session]);
      }

      await removeWindowInstance(location.state?.windowId, 100);
    })();
  }, [location.state, primaryWalletId, sessions]);

  const handleRemoveSession = async (session: SessionStore.Session) => {
    try {
      const confirmed = await confirm({
        sessionDomain: session.domain,
      });
      if (!confirmed) return;

      await disconnectSessions([session]);
    } catch (error) {
      onError(error, false);
    }
  };

  const handleRemoveAllSession = async () => {
    try {
      const confirmed = await confirm({
        numberOfSessions: Object.keys(sessions).length,
      });
      if (!confirmed) return;

      await disconnectSessions(Object.values(sessions));
    } catch (error) {
      onError(error, false);
    }
  };

  const confirm = ({
    sessionDomain,
    numberOfSessions,
  }: {
    sessionDomain?: string;
    numberOfSessions?: number;
  }) => {
    return new Promise((resolve) => {
      setState({
        sessionDomain,
        numberOfSessions,
        isOpen: !state.isOpen,
        onConfirm() {
          setState(initialState);
          resolve(true);
        },
        onCancel() {
          setState(initialState);
          resolve(false);
        },
      });
    });
  };

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
                backgroundColor={currentThemeMode === ThemeMode.LIGHT ? 'gray50' : 'black'}
              >
                <ConnectionLogoImage appLogo={session.logo} alt={session.domain} roundCorners />
              </FlexContainer>

              <Container width='calc(100% - 96px)'>
                <div>
                  <Tooltip
                    content={<StyledSpan>{formatDomain(session.domain, false)}</StyledSpan>}
                    placement='top'
                  >
                    <Paragraph
                      $typeset='headline'
                      fontWeight='medium'
                      color='base'
                      display='inline'
                    >
                      <span>{formatDomain(session.domain, false)}</span>
                    </Paragraph>
                  </Tooltip>
                </div>

                <Tooltip content={getWalletAddress(session.walletId)} placement='bottom-start'>
                  <Paragraph
                    $typeset='body'
                    color='gray'
                    fontWeight='regular'
                    mt='4'
                    display='inline'
                  >
                    Connected with{' '}
                    <strong>{trimAddress(getWalletName(session.walletId), 14)}</strong>
                  </Paragraph>
                </Tooltip>
              </Container>

              <Tooltip content='Disconnect' placement='left'>
                <StyledFlexContainer
                  isDark={currentThemeMode === ThemeMode.DARK}
                  width='32px'
                  height='32px'
                  alignItems='center'
                  justifyContent='center'
                  borderRadius='50%'
                  onClick={() => {
                    handleRemoveSession(session);
                  }}
                  as='button'
                >
                  <Icon icon='slash' width='18px' height='18px' />
                </StyledFlexContainer>
              </Tooltip>
            </StyledRow>
          );
        })}
      </FlexContainer>
      <Button variant='destructiveSecondary' onClick={handleRemoveAllSession} mt='16'>
        Disconnect All
      </Button>
      {state.isOpen && (
        <Modal
          onClose={state.onCancel}
          onCancel={state.onCancel}
          icon='alert-octagon'
          variant='danger'
          onResolve={async () => {
            await browser.runtime.sendMessage({
              type: 'DISCONNECT_RESOLVE',
              data: {
                domain: state.sessionDomain,
                status: 'success',
                disconnected: false,
              },
            });

            state.onConfirm();
          }}
          hideCloseButton
          focusTrapOptions={{
            initialFocus: false,
          }}
        >
          <RemoveConnections
            sessionDomain={state.sessionDomain}
            numberOfSessions={state.numberOfSessions}
          />
        </Modal>
      )}
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
  padding: 8px;
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
      background-color: ${isDark ? theme.colors.gray700 : theme.colors.gray50};
    `}
  }

  ${({ theme }) => (isFirefox ? theme.browserCompatibility.firefox.focus : '')}
`;

const StyledSpan = styled.span`
  word-wrap: break-word;
`;

export default ConnectionsList;
