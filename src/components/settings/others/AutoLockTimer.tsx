import { useLocation, useNavigate } from 'react-router-dom';
import browser from 'webextension-polyfill';
import SubPageLayout, { SettingsRowItem } from '../SubPageLayout';
import { Container, Icon, Paragraph } from '@/shared/components';
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
    browser.runtime.sendMessage({
      type: 'AUTOLOCK_TIMER_CHANGED',
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
            className={location.state?.autoLockTimer === timerKey ? 'active' : ''}
            onClick={() => changeAutoLockTimer(timerKey)}
            tabIndex={0}
            as='button'
            backgroundColor='transparent'
            border='none'
            width='100%'
          >
            <Paragraph $typeset='headline' as='span'>
              {showAutoLockTimerValue(timerKey)}
            </Paragraph>
            {location.state?.autoLockTimer === timerKey && (
              <Icon icon='check' width='20px' height='20px' />
            )}
          </SettingsRowItem>
        ))}
      </Container>
    </SubPageLayout>
  );
};

export default AutoLockTimer;
