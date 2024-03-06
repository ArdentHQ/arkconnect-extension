import { useState } from 'react';
import ConnectionIndicator from './ConnectionIndicator';
import { DisconnectSessionModal } from './DisconnectSessionModal';
import { useActiveTabConnection } from '@/lib/hooks/useActiveTabConnection';
import { Icon, Paragraph, Tooltip } from '@/shared/components';
import Modal from '@/shared/components/modal/Modal';
import ConnectedAddress from '@/components/wallet/ConnectedAddress';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import useThemeMode from '@/lib/hooks/useThemeMode';
import DisconnectedAddress from '@/components/wallet/DisconnectedAddress';
import { HeaderButton } from '@/shared/components/header/HeaderButton';

export const ConnectionStatus = () => {
    const { currentThemeMode } = useThemeMode();
    const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const primaryWallet = usePrimaryWallet();

    const { tabSession, getConnectedSiteData } = useActiveTabConnection({ wallet: primaryWallet });
    const { logo, connectedTo } = getConnectedSiteData();

    return (
        <>
            {tabSession ? (
                <HeaderButton
                    className='rounded-full text-theme-primary-700 dark:thext-theme-primary-600'
                    onClick={() => setIsModalOpen(true)}
                >
                    <Icon
                        icon='globe-with-dot'
                        className={currentThemeMode + ' globeIcon h-4 w-4'}
                    />
                </HeaderButton>
            ) : (
                <Tooltip
                    content={
                        <Paragraph>
                            This ARK address isn’t <br /> connected to this site.
                        </Paragraph>
                    }
                    placement='bottom-end'
                >
                    <HeaderButton className='rounded-full' onClick={() => setIsModalOpen(true)}>
                        <Icon icon='globe' className='h-4 w-4' />
                    </HeaderButton>
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
