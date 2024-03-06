import { useState } from 'react';
import { Button, Checkbox, FlexContainer, Paragraph, WarningIcon } from '@/shared/components';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useThemeMode from '@/lib/hooks/useThemeMode';
import useResetExtension from '@/lib/hooks/useResetExtension';

const ForgotPassword = () => {
    const resetExtension = useResetExtension();
    const [lostPasswordAwareness, setLostPasswordAwareness] = useState<boolean>(false);

    const { getThemeColor } = useThemeMode();

    return (
        <SubPageLayout title='Forgot Password?' onBack='goBack' paddingBottom='0'>
            <FlexContainer flexDirection='column' justifyContent='space-between' height='100%'>
                <Paragraph
                    $typeset='headline'
                    fontWeight='regular'
                    color={getThemeColor('secondary500', 'secondary300')}
                >
                    Unfortunately there is no recovery method available other than resetting the
                    extension and re-importing your address(es). Ensure that you have your
                    passphrase(s) saved.
                </Paragraph>

                <FlexContainer justifyContent='center' alignItems='center'>
                    <WarningIcon />
                </FlexContainer>

                <FlexContainer flexDirection='column'>
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
                </FlexContainer>
            </FlexContainer>
        </SubPageLayout>
    );
};

export default ForgotPassword;
