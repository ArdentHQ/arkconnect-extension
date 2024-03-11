import { useLocation, useNavigate } from 'react-router-dom';
import { runtime } from 'webextension-polyfill';
import SubPageLayout, { SettingsRowItem } from '../SubPageLayout';
import { Container, Icon } from '@/shared/components';
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

    const changeAutoLockTimer = async (autoLockValue: AutoLockTimerEnum) => {
        await setLocalValue('autoLockTimer', autoLockValue);
        runtime.sendMessage({
            type: 'REFRESH_AUTOLOCK_TIMER',
            data: {
                autoLockValue,
            },
        });
        toast('success', 'Auto lock timer changed successfully', ToastPosition.HIGH);
        navigate('/');
    };

    return (
        <SubPageLayout title='Auto Lock Timer'>
            <Container borderRadius='16' paddingY='8' bg='secondaryBackground'>
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
            </Container>
        </SubPageLayout>
    );
};

export default AutoLockTimer;
