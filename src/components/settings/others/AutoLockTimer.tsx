import { useLocation, useNavigate } from 'react-router-dom';
import { runtime } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import SubPageLayout, { SettingsRowItem } from '@/components/settings/SubPageLayout';
import { Icon } from '@/shared/components';
import useToast from '@/lib/hooks/useToast';
import { AutoLockTimer as AutoLockTimerEnum, setLocalValue } from '@/lib/utils/localStorage';
import showAutoLockTimerValue from '@/lib/utils/showAutoLockTimerValue';
import { ToastPosition } from '@/components/toast/ToastContainer';

const timerKeys = Object.values(AutoLockTimerEnum).filter(
    (item) => typeof item === 'number',
) as number[];

const AutoLockTimer = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const changeAutoLockTimer = async (autoLockValue: AutoLockTimerEnum) => {
        await setLocalValue('autoLockTimer', autoLockValue);
        runtime.sendMessage({
            type: 'REFRESH_AUTOLOCK_TIMER',
            data: {
                autoLockValue,
            },
        });
        toast(
            'success',
            t('PAGES.SETTINGS.FEEDBACK.AUTOLOCK_TIMER_CHANGED_SUCCESSFULLY'),
            ToastPosition.HIGH,
        );
        navigate('/');
    };

    return (
        <SubPageLayout title={t('PAGES.SETTINGS.AUTO_LOCK_TIMER')}>
            <div className='rounded-2xl bg-white py-2 dark:bg-subtle-black'>
                {timerKeys.map((timerKey) => (
                    <SettingsRowItem
                        key={timerKey}
                        active={location.state?.autoLockTimer === timerKey}
                        onClick={() => changeAutoLockTimer(timerKey)}
                    >
                        <span className='typeset-headline'>{showAutoLockTimerValue(timerKey)}</span>
                        {location.state?.autoLockTimer === timerKey && (
                            <Icon icon='check' className='h-5 w-5' />
                        )}
                    </SettingsRowItem>
                ))}
            </div>
        </SubPageLayout>
    );
};

export default AutoLockTimer;
