import { useState } from 'react';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { Button, HeadingDescription, PassphraseInput, ToggleSwitch } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import { ToastPosition } from '@/components/toast/ToastContainer';

type Props = {
    privateKey: string;
};

const YourPrivateKey = ({ privateKey }: Props) => {
    const { copy } = useClipboard();
    const [showPrivateKey, setShowPassphrase] = useState<boolean>(false);

    const handleCopyToClipboard = () => {
        copy(privateKey, 'Private key', ToastPosition.HIGH);
    };

    return (
        <SubPageLayout title='Show Private Key' hideCloseButton={false} noPaddingBottom>
            <div className='flex h-full flex-col'>
                <HeadingDescription className='mb-4'>
                    Remember, anyone with your private key can steal your assets. Do not share this
                    publicly.
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
                            title='Show Private Key'
                        />
                    </div>

                    <Button
                        variant='secondary'
                        iconLeading='copy'
                        onClick={handleCopyToClipboard}
                        className='mb-3'
                    >
                        Copy to Clipboard
                    </Button>
                </div>
            </div>
        </SubPageLayout>
    );
};

export default YourPrivateKey;
