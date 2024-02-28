import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import browser from 'webextension-polyfill';
import SubPageLayout from '../SubPageLayout';
import SelectNetworkTypeModal from './SelectNetworkTypeModal';
import {
    RowLayout,
    Container,
    FlexContainer,
    Icon,
    IconDefinition,
    Paragraph,
    Tooltip,
} from '@/shared/components';
import { useAppDispatch } from '@/lib/store';
import { testnetEnabledChanged } from '@/lib/store/ui';
import { handleSubmitKeyAction } from '@/lib/utils/handleKeyAction';
import { isFirefox } from '@/lib/utils/isFirefox';
import { clearPersistScreenData } from '@/components/wallet/form-persist/helpers';

type NetworkModalState = {
    nextAction?: () => void;
    isOpen: boolean;
    action?: 'import' | 'create';
};

const CreateOrImportAddress = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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
            nextAction: () => navigate('/wallet/create'),
            isOpen: true,
            action: 'create',
        });
    };

    const handleImportAddress = () => {
        setNetworkModalState({
            nextAction: () => navigate('/wallet/import'),
            isOpen: true,
            action: 'import',
        });
    };

    const handleConnectLedger = () => {
        if (isFirefox) return;

        setNetworkModalState({
            nextAction: () => {
                void browser.tabs.create({
                    url: browser.runtime.getURL('/src/main.html?import_with_ledger'),
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
                        dispatch(testnetEnabledChanged(isTestnet));
                        networkModalState.nextAction?.();
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
