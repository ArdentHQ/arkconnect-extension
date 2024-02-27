import { useState } from 'react';
import ConnectionIndicator from './ConnectionIndicator';
import { useActiveTabConnection } from '@/lib/hooks/useActiveTabConnection';
import { Icon, Paragraph, Tooltip } from '@/shared/components';
import Modal from '@/shared/components/modal/Modal';
import ConnectedAddress from '@/components/wallet/ConnectedAddress';
import { StyledFlexContainer } from '@/shared/components/header/Header';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import useThemeMode from '@/lib/hooks/useThemeMode';
import DisconnectedAddress from '@/components/wallet/DisconnectedAddress';

export const ConnectionStatus = () => {
  const { currentThemeMode, getThemeColor } = useThemeMode();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const primaryWallet = usePrimaryWallet();

  const { tabSession, getConnectedSiteData } = useActiveTabConnection({ wallet: primaryWallet });
  const { logo, connectedTo } = getConnectedSiteData();

  return (
    <>
      {tabSession ? (
        <StyledFlexContainer
          borderRadius='50'
          padding='8'
          color={getThemeColor('primary700', 'primary600')}
          className='c-pointer'
          onClick={() => setIsModalOpen(true)}
          as='button'
          backgroundColor='transparent'
          border='none'
        >
          <Icon
            icon='globe-with-dot'
            className={currentThemeMode + ' globeIcon'}
            width='16px'
            height='16px'
          />
        </StyledFlexContainer>
      ) : (
        <Tooltip
          content={
            <Paragraph>
              This ARK address isn’t <br /> connected to this site.
            </Paragraph>
          }
          placement='bottom-end'
        >
          <StyledFlexContainer
            borderRadius='50'
            padding='8'
            color='base'
            className='c-pointer'
            onClick={() => setIsModalOpen(true)}
            as='button'
            backgroundColor='transparent'
            border='none'
          >
            <Icon icon='globe' width='16px' height='16px' />
          </StyledFlexContainer>
        </Tooltip>
      )}

      {isModalOpen && (
        <>
          {tabSession && primaryWallet ? (
            <Modal
              onClose={() => setIsModalOpen(false)}
              icon={<ConnectionIndicator isConnected={true} />}
            >
              <ConnectedAddress
                connectedTo={connectedTo}
                wallet={primaryWallet}
                logo={logo}
                address={primaryWallet.address()}
              />
            </Modal>
          ) : (
            <Modal
              onClose={() => setIsModalOpen(false)}
              icon={<ConnectionIndicator isConnected={false} />}
            >
              <DisconnectedAddress />
            </Modal>
          )}
        </>
      )}
    </>
  );
};
