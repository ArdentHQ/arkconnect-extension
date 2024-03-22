import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, HeadingDescription, WarningIcon } from '@/shared/components';
import SubPageLayout from '@/components/settings/SubPageLayout';
import useResetExtension from '@/lib/hooks/useResetExtension';

const ForgotPassword = () => {
    const resetExtension = useResetExtension();
    const [lostPasswordAwareness, setLostPasswordAwareness] = useState<boolean>(false);
    const { t } = useTranslation();

    return (
        <SubPageLayout
            title={t('PAGES.FORGOT_PASSWORD.FORGOT_PASSWORD')}
            onBack='goBack'
            noPaddingBottom
        >
            <div className='flex h-full flex-col justify-between'>
                <HeadingDescription>
                    {t('PAGES.FORGOT_PASSWORD.NO_RECOVERY_METHOD_AVAILABLE_DISCLAIMER')}
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
                        title={t('PAGES.FORGOT_PASSWORD.RESET_WILL_RESULT_LOSS_OF_DATA_DISCLAIMER')}
                    />
                    <Button
                        variant='primary'
                        disabled={!lostPasswordAwareness}
                        className='mt-6'
                        onClick={resetExtension}
                    >
                        {t('PAGES.FORGOT_PASSWORD.RESET_EXTENSION')}
                    </Button>
                </div>
            </div>
        </SubPageLayout>
    );
};

export default ForgotPassword;
