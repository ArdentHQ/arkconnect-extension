import { useNavigate } from 'react-router-dom';
import { runtime, tabs } from 'webextension-polyfill';
import { useEffect } from 'react';
import { BigButton, HeadingDescription, Tooltip } from '@/shared/components';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { isFirefox } from '@/lib/utils/isFirefox';
import constants from '@/constants';

const InitialImportWallet = () => {
    const navigate = useNavigate();

    useEffect(() => {
        void runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
    }, []);

    return (
        <SubPageLayout title='Import an Existing Address' onBack='goBack'>
            <HeadingDescription className='mb-6'>
                Select an option below that you would like to proceed with...
            </HeadingDescription>
            <BigButton
                iconLeading='key'
                iconTrailing='arrow-right'
                title='Enter Passphrase'
                helperText='Use your 12 or 24-word passphrase to securely access your address.'
                className='text-theme-primary-700 dark:text-theme-primary-650 mb-2'
                onClick={() => navigate('/wallet/import')}
            />

            <Tooltip
                disabled={!isFirefox}
                content={
                    <p>
                        ARK Connect requires the use of a chromium <br /> based browser when using a
                        Ledger.
                    </p>
                }
                placement='bottom'
            >
                <div>
                    <BigButton
                        iconLeading='usb-flash-drive'
                        iconTrailing='arrow-right'
                        title='Connect Ledger Device'
                        helperText='Import your ARK address using a Ledger device. A new tab will open.'
                        disabled={isFirefox}
                        onClick={() => {
                            if (isFirefox) return;
                            tabs.create({
                                url: runtime.getURL(`/${constants.POPUP_PAGE}?import_with_ledger`),
                            });
                            window.close(); // Close extension popup as we navigate away
                        }}
                        className='text-theme-primary-700 dark:text-theme-primary-650'
                    />
                </div>
            </Tooltip>
        </SubPageLayout>
    );
};

export default InitialImportWallet;
