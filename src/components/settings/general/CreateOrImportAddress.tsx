import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { runtime, tabs } from 'webextension-polyfill';
import SubPageLayout from '../SubPageLayout';
import SelectNetworkTypeModal from './SelectNetworkTypeModal';
import { Icon, IconDefinition, RowLayout, Tooltip } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type NetworkModalState = {
    nextAction?: (isTestnet: boolean) => void;
    isOpen: boolean;
    action?: 'import' | 'create';
};

const CreateOrImportAddress = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear any old data
        void runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
    }, []);

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
            <div>
                <RowLayout
                    title='Create New Address'
                    helperText='By creating a new passphrase'
                    iconLeading={<LeadingIcon icon='plus-circle' />}
                    iconTrailing='arrow-right'
                    onClick={handleCreateNewAddress}
                    className='mb-2'
                />

                <RowLayout
                    title='Import an Address'
                    helperText='By using existing passphrase'
                    iconLeading={<LeadingIcon icon='download' />}
                    iconTrailing='arrow-right'
                    onClick={handleImportAddress}
                    className='mb-2'
                />

                <Tooltip
                    disabled={!isFirefox}
                    content={
                        <p>
                            ARK Connect requires the use of a chromium <br /> based browser when
                            using a Ledger.
                        </p>
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
                    />
                </Tooltip>
            </div>

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
        <span className='text-theme-seoncdary-500 flex items-center justify-center self-center dark:text-theme-secondary-300'>
            <Icon className='h-5 w-5' icon={icon} />
        </span>
    );
};

export default CreateOrImportAddress;
