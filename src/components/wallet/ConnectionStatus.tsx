import { useState } from 'react';
import ConnectionIndicator from './ConnectionIndicator';
import { DisconnectSessionModal } from './DisconnectSessionModal';
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
    const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

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
                >
                    <Icon
                        icon='globe-with-dot'
                        className={currentThemeMode + ' globeIcon h-4 w-4'}
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
                    >
                        <Icon icon='globe' className='h-4 w-4' />
                    </StyledFlexContainer>
                </Tooltip>
            )}

            {isModalOpen && (
                <>
                    {tabSession && primaryWallet ? (
                        <Modal
                            onClose={() => setIsModalOpen(false)}
                            icon={<ConnectionIndicator isConnected={true} />}
                            focusTrapOptions={{
                                initialFocus: false,
                            }}
                        >
                            <ConnectedAddress
                                connectedTo={connectedTo}
                                wallet={primaryWallet}
                                logo={logo}
                                address={primaryWallet.address()}
                                onDisconnect={() => {
                                    setIsModalOpen(false);
                                    setIsDisconnectModalOpen(true);
                                }}
                            />
                        </Modal>
                    ) : (
                        <Modal
                            onClose={() => setIsModalOpen(false)}
                            icon={<ConnectionIndicator isConnected={false} />}
                            focusTrapOptions={{
                                initialFocus: false,
                            }}
                        >
                            <DisconnectedAddress />
                        </Modal>
                    )}
                </>
            )}

            <DisconnectSessionModal
                isOpen={isDisconnectModalOpen}
                sessions={tabSession ? [tabSession] : []}
                onConfirm={() => setIsDisconnectModalOpen(false)}
                onCancel={() => setIsDisconnectModalOpen(false)}
            />
        </>
    );
};
