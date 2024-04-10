import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { runtime, tabs } from 'webextension-polyfill';
import { Trans, useTranslation } from 'react-i18next';
import SelectNetworkTypeModal from './SelectNetworkTypeModal';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Icon, IconDefinition, RowLayout, Tooltip } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type NetworkModalState = {
    nextAction?: (isTestnet: boolean) => void;
    isOpen: boolean;
    action?: 'import' | 'create';
};

const CreateOrImportAddress = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

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
        <SubPageLayout title={t('PAGES.SETTINGS.CREATE_N_IMPORT_ADDRESS')}>
            <div>
                <RowLayout
                    title={t('PAGES.SETTINGS.CREATE_NEW_ADDRESS')}
                    helperText={t('PAGES.SETTINGS.BY_CREATING_A_NEW_PASSPHRASE')}
                    iconLeading={<LeadingIcon icon='plus-circle' />}
                    iconTrailing='arrow-right'
                    onClick={handleCreateNewAddress}
                    className='mb-2'
                />

                <RowLayout
                    title={t('PAGES.SETTINGS.IMPORT_AN_ADDRESS')}
                    helperText={t('PAGES.SETTINGS.BY_USING_EXISTING_PASSPHRASE')}
                    iconLeading={<LeadingIcon icon='download' />}
                    iconTrailing='arrow-right'
                    onClick={handleImportAddress}
                    className='mb-2'
                />

                <Tooltip
                    disabled={!isFirefox}
                    content={
                        <p>
                            <Trans
                                i18nKey='PAGES.SETTINGS.ARK_CONNECT_REQUIRES_TO_USE_CHROMIUM'
                                components={{ strong: <strong /> }}
                            />
                        </p>
                    }
                    placement='bottom'
                >
                    <RowLayout
                        title={t('PAGES.SETTINGS.CONNECT_A_LEDGER')}
                        helperText={t('PAGES.SETTINGS.IMPORT_ADDRESSES_USING_LEDGER')}
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
