import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Button, HeadingDescription, PassphraseInput, ToggleSwitch } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import { ToastPosition } from '@/components/toast/ToastContainer';
import { CommonFooter } from '@/shared/components/utils/CommonFooter';

type Props = {
    passphrase: string;
};

const YourPassphrase = ({ passphrase }: Props) => {
    const { t } = useTranslation();
    const { copy } = useClipboard();
    const [showPassphrase, setShowPassphrase] = useState<boolean>(false);

    const handleCopyToClipboard = () => {
        copy(passphrase, t('COMMON.PASSPHRASE'), ToastPosition.HIGH);
    };

    return (
        <SubPageLayout
            title={t('PAGES.SETTINGS.SHOW_PASSPHRASE')}
            hideCloseButton={false}
            footer={
                <CommonFooter variant='simple'>
                    <Button variant='secondary' iconLeading='copy' onClick={handleCopyToClipboard}>
                        {t('ACTION.COPY_TO_CLIPBOARD')}
                    </Button>
                </CommonFooter>
            }
        >
            <div className='flex h-full flex-col'>
                <HeadingDescription className='mb-4'>
                    {t('PAGES.SETTINGS.SHOW_PASSPHRASE_DISCLAIMER')}
                </HeadingDescription>
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
                </div>
            </div>
        </SubPageLayout>
    );
};

export default YourPassphrase;
