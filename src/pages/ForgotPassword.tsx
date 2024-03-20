import { useState } from 'react';
import { Button, Checkbox, HeadingDescription, WarningIcon } from '@/shared/components';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useResetExtension from '@/lib/hooks/useResetExtension';

const ForgotPassword = () => {
    const resetExtension = useResetExtension();
    const [lostPasswordAwareness, setLostPasswordAwareness] = useState<boolean>(false);

    return (
        <SubPageLayout title='Forgot Password?' onBack='goBack' noPaddingBottom>
            <div className='flex h-full flex-col justify-between'>
                <HeadingDescription>
                    Unfortunately there is no recovery method available other than resetting the
                    extension and re-importing your address(es). Ensure that you have your
                    passphrase(s) saved.
                </HeadingDescription>

                <div className='flex items-center justify-center'>
                    <WarningIcon />
                </div>

                <div className='flex flex-col'>
                    <Checkbox
                        id='lostPassword'
                        name='lostPasswordAwareness'
                        checked={lostPasswordAwareness}
                        onChange={(evt) => setLostPasswordAwareness(evt.target.checked)}
                        title='I am aware that resetting the extension will result in the loss of all data, including locally stored passphrases.'
                    />
                    <Button
                        variant='primary'
                        disabled={!lostPasswordAwareness}
                        className='mt-6'
                        onClick={resetExtension}
                    >
                        Reset Extension
                    </Button>
                </div>
            </div>
        </SubPageLayout>
    );
};

export default ForgotPassword;
