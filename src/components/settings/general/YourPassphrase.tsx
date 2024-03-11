import { useState } from 'react';
import SubPageLayout from '../SubPageLayout';
import { Button, Paragraph, PassphraseInput, ToggleSwitch } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import { ToastPosition } from '@/components/toast/ToastContainer';

type Props = {
    passphrase: string;
};

const YourPassphrase = ({ passphrase }: Props) => {
    const { copy } = useClipboard();
    const [showPassphrase, setShowPassphrase] = useState<boolean>(false);

    const handleCopyToClipboard = () => {
        copy(passphrase, 'Passphrase', ToastPosition.HIGH);
    };

    return (
        <SubPageLayout title='Show Passphrase' hideCloseButton={false} noPaddingBottom>
            <div className='flex h-full flex-col'>
                <Paragraph $typeset='headline' color='gray' mb='16'>
                    Remember, anyone with your passphrase can steal your assets. Do not share this
                    publicly.
                </Paragraph>
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
                            title='Show Passphrase'
                        />
                    </div>

                    <Button variant='secondary' iconLeading='copy' onClick={handleCopyToClipboard}>
                        Copy to Clipboard
                    </Button>
                </div>
            </div>
        </SubPageLayout>
    );
};

export default YourPassphrase;
