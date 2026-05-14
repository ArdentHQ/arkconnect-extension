import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { runtime, tabs } from 'webextension-polyfill';
import { Trans, useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Icon, IconDefinition, RowLayout, Tooltip } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

const CreateOrImportAddress = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        // Clear any old data
        void runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
    }, []);

    const handleCreateNewAddress = () => {
        navigate('/wallet/create');
    };

    const handleImportAddress = () => {
        navigate('/wallet/import');
    };

    const handleConnectLedger = () => {
        if (isFirefox) return;

        void tabs.create({
            url: runtime.getURL('/src/main.html?import_with_ledger'),
        });
        window.close(); // Close extension popup as we navigate away
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
        </SubPageLayout>
    );
};

const LeadingIcon = ({ icon }: { icon: IconDefinition }) => {
    return (
        <span className='text-theme-seoncdary-500 dark:text-theme-secondary-300 flex items-center justify-center self-center'>
            <Icon className='h-5 w-5' icon={icon} />
        </span>
    );
};

export default CreateOrImportAddress;
