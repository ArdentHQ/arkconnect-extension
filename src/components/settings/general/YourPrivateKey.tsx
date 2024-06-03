import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Button, HeadingDescription, PassphraseInput, ToggleSwitch } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import { ToastPosition } from '@/components/toast/ToastContainer';

type Props = {
    privateKey: string;
};

const YourPrivateKey = ({ privateKey }: Props) => {
    const { t } = useTranslation();
    const { copy } = useClipboard();
    const [showPrivateKey, setShowPassphrase] = useState<boolean>(false);

    const handleCopyToClipboard = () => {
        copy(privateKey, t('COMMON.PRIVATE_KEY'), ToastPosition.HIGH);
    };

    return (
        <SubPageLayout title={t('PAGES.SETTINGS.SHOW_PRIVATE_KEY')} hideCloseButton={false}>
            <div className='flex h-full flex-col'>
                <HeadingDescription className='mb-4'>
                    {t('PAGES.SETTINGS.SHOW_PRIVATE_KEY_DISCLAIMER')}
                </HeadingDescription>

                <div className='flex flex-1 flex-col justify-between'>
                    <div>
                        <div className='relative mb-4'>
                            <PassphraseInput
                                name='privateKey'
                                className='read-only max-h-[70px]'
                                rows={2}
                                value={privateKey}
                                hideValue={!showPrivateKey}
                                variant='primary'
                                readOnly
                                disabled
                            />
                        </div>
                        <ToggleSwitch
                            checked={showPrivateKey}
                            onChange={() => setShowPassphrase(!showPrivateKey)}
                            id='show-private-key'
                            title={t('PAGES.SETTINGS.SHOW_PRIVATE_KEY')}
                        />
                    </div>

                    <Button
                        variant='secondary'
                        iconLeading='copy'
                        onClick={handleCopyToClipboard}
                        className='mb-3'
                    >
                        {t('ACTION.COPY_TO_CLIPBOARD')}
                    </Button>
                </div>
            </div>
        </SubPageLayout>
    );
};

export default YourPrivateKey;
