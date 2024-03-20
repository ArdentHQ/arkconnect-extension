import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Button, PassphraseInput, ToggleSwitch } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import { ToastPosition } from '@/components/toast/ToastContainer';

type Props = {
    passphrase: string;
};

const YourPassphrase = ({ passphrase }: Props) => {
    const { t } = useTranslation();
    const { copy } = useClipboard();
    const [showPassphrase, setShowPassphrase] = useState<boolean>(false);

    const handleCopyToClipboard = () => {
        copy(passphrase, t('MISC.PASSPHRASE'), ToastPosition.HIGH);
    };

    return (
        <SubPageLayout
            title={t('PAGES.SETTINGS.SHOW_PASSPHRASE')}
            hideCloseButton={false}
            noPaddingBottom
        >
            <div className='flex h-full flex-col'>
                <p className='typeset-headline mb-4 text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {t('PAGES.SETTINGS.SHOW_PASSPHRASE_DISCLAIMER')}
                </p>
                <div className='flex flex-1 flex-col justify-between'>
                    <div>
                        <div className='relative mb-4'>
                            <PassphraseInput
                                name='privateKey'
                                className='read-only max-h-[145px]'
                                rows={5}
                                value={passphrase}
                                hideValue={!showPassphrase}
                                variant='primary'
                                readOnly
                                disabled
                            />
                        </div>
                        <ToggleSwitch
                            checked={showPassphrase}
                            onChange={() => setShowPassphrase(!showPassphrase)}
                            id='show-passphrase'
                            title={t('PAGES.SETTINGS.SHOW_PASSPHRASE')}
                        />
                    </div>

                    <Button variant='secondary' iconLeading='copy' onClick={handleCopyToClipboard}>
                        {t('ACTION.COPY_TO_CLIPBOARD')}
                    </Button>
                </div>
            </div>
        </SubPageLayout>
    );
};

export default YourPassphrase;
