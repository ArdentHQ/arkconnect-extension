import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { runtime, tabs } from 'webextension-polyfill';
import SubPageLayout from '../SubPageLayout';
import SelectNetworkTypeModal from './SelectNetworkTypeModal';
import {
    Container,
    FlexContainer,
    Icon,
    IconDefinition,
    Paragraph,
    RowLayout,
    Tooltip,
} from '@/shared/components';
import { handleSubmitKeyAction } from '@/lib/utils/handleKeyAction';
import { isFirefox } from '@/lib/utils/isFirefox';
import { clearPersistScreenData } from '@/components/wallet/form-persist/helpers';

type NetworkModalState = {
    nextAction?: (isTestnet: boolean) => void;
    isOpen: boolean;
    action?: 'import' | 'create';
};

const CreateOrImportAddress = () => {
    const navigate = useNavigate();

    // Clear any old data
    clearPersistScreenData();

    const [networkModalState, setNetworkModalState] = useState<NetworkModalState>({
        nextAction: undefined,
        isOpen: false,
        action: undefined,
    });

    const onCloseModalHandler = () => setNetworkModalState({ ...networkModalState, isOpen: false });

    const handleCreateNewAddress = () => {
        setNetworkModalState({
            nextAction: (isTestnet: boolean) =>
                navigate('/wallet/create', {
                    state: {
                        isTestnet,
                    },
                }),
            isOpen: true,
            action: 'create',
        });
    };

    const handleImportAddress = () => {
        setNetworkModalState({
            nextAction: (isTestnet: boolean) =>
                navigate('/wallet/import', {
                    state: {
                        isTestnet,
                    },
                }),
            isOpen: true,
            action: 'import',
        });
    };

    const handleConnectLedger = () => {
        if (isFirefox) return;

        setNetworkModalState({
            nextAction: (isTestnet: boolean) => {
                const testnetParam = isTestnet ? 'isTestnet' : '';

                void tabs.create({
                    url: runtime.getURL(`/src/main.html?import_with_ledger&${testnetParam}`),
                });
                window.close(); // Close extension popup as we navigate away
            },
            isOpen: true,
            action: 'import',
        });
    };

    return (
        <SubPageLayout title='Create & Import Address'>
            <Container>
                <RowLayout
                    title='Create New Address'
                    helperText='By creating a new passphrase'
                    iconLeading={<LeadingIcon icon='plus-circle' />}
                    iconTrailing='arrow-right'
                    onClick={handleCreateNewAddress}
                    mb='8'
                    onKeyDown={(e) => handleSubmitKeyAction(e, handleCreateNewAddress)}
                />

                <RowLayout
                    title='Import an Address'
                    helperText='By using existing passphrase'
                    iconLeading={<LeadingIcon icon='download' />}
                    iconTrailing='arrow-right'
                    onClick={handleImportAddress}
                    onKeyDown={(e) => handleSubmitKeyAction(e, handleImportAddress)}
                    mb='8'
                    as='button'
                />

                <Tooltip
                    disabled={!isFirefox}
                    content={
                        <Paragraph>
                            ARK Connect requires the use of a chromium <br /> based browser when
                            using a Ledger.
                        </Paragraph>
                    }
                    placement='bottom'
                >
                    <RowLayout
                        title='Connect a Ledger'
                        helperText='Import addresses using a Ledger'
                        iconLeading={<LeadingIcon icon='usb-flash-drive' />}
                        iconTrailing='arrow-right'
                        onClick={handleConnectLedger}
                        disabled={isFirefox}
                        as='button'
                        onKeyDown={(e) => handleSubmitKeyAction(e, handleConnectLedger)}
                    />
                </Tooltip>
            </Container>

            {networkModalState.isOpen && (
                <SelectNetworkTypeModal
                    onClose={onCloseModalHandler}
                    action={networkModalState.action}
                    onNetworkSelect={(isTestnet: boolean) => {
                        networkModalState.nextAction?.(isTestnet);
                    }}
                />
            )}
        </SubPageLayout>
    );
};

const LeadingIcon = ({ icon }: { icon: IconDefinition }) => {
    return (
        <FlexContainer
            justifyContent='center'
            alignItems='center'
            alignSelf='center'
            color='gray'
            as='span'
        >
            <Icon className='h-5 w-5' icon={icon} />
        </FlexContainer>
    );
};

export default CreateOrImportAddress;
